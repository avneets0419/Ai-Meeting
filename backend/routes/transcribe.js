import express from "express";
import multer from "multer";
import axios from "axios";
import https from "https";
import { PrismaClient } from "@prisma/client";
import { generateMeetingMetadata } from "../services/geminiService.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const upload = multer(); // memory storage
const prisma =new PrismaClient()

// Config
const ASSEMBLYAI_KEY = process.env.ASSEMBLYAI_API_KEY;
if (!ASSEMBLYAI_KEY) {
  console.error("ERROR: set ASSEMBLYAI_API_KEY env var before starting server");
  process.exit(1);
}

const UPLOAD_ENDPOINT = "https://api.assemblyai.com/v2/upload";
const TRANSCRIPT_ENDPOINT = "https://api.assemblyai.com/v2/transcript";

// Keep-alive agent to reduce socket churn
const httpsAgent = new https.Agent({ 
  keepAlive: true, 
  maxSockets: 10,
  timeout: 300000, // 5 minutes
});

async function retry(fn, { retries = 4, baseDelay = 500 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`Retry attempt ${attempt} failed: ${err.message}. waiting ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// Upload entire buffer to AssemblyAI (NO chunking - AssemblyAI handles the file as-is)
async function uploadBufferToAssemblyAI(buffer) {
  console.log(`📤 Uploading ${(buffer.length / 1024 / 1024).toFixed(2)} MB to AssemblyAI...`);
  
  const res = await axios({
    method: "POST",
    url: UPLOAD_ENDPOINT,
    headers: {
      authorization: ASSEMBLYAI_KEY,
      "Content-Type": "application/octet-stream",
    },
    data: buffer, // Send entire buffer at once
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    httpsAgent,
    timeout: 300000, // 5 minutes
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Upload progress: ${percentCompleted}%`);
    },
  });

  console.log(`✅ Upload complete: ${res.data.upload_url}`);
  return res.data.upload_url;
}

// Request transcription
async function createTranscript(upload_url) {
  const body = {
    audio_url: upload_url,
    speaker_labels: true, // Enable speaker diarization
    summarization: true, // Enable AI summary
    summary_model: "informative",
    summary_type: "bullets",
    punctuate: true,
    format_text: true,
  };

  const res = await axios.post(TRANSCRIPT_ENDPOINT, body, {
    headers: {
      authorization: ASSEMBLYAI_KEY,
      "Content-Type": "application/json",
    },
    httpsAgent,
    timeout: 60000,
  });

  return res.data; // contains id
}

// Get transcript status
async function getTranscriptStatus(transcriptId) {
  const res = await axios.get(`${TRANSCRIPT_ENDPOINT}/${transcriptId}`, {
    headers: { 
      authorization: ASSEMBLYAI_KEY 
    },
    httpsAgent,
    timeout: 30000,
  });
  return res.data;
}

// Format audio duration to readable time string
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  return `${minutes}m ${secs}s`;
}

router.post("/transcribe", authMiddleware, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No audio file uploaded" });
    }

    // Get userId from authenticated token (set by middleware)
    const userId = req.userId;
    console.log("👤 Authenticated user:", userId);

    const buffer = req.file.buffer;
    const fileSizeMB = (buffer.length / 1024 / 1024).toFixed(2);
    console.log(`📁 Received file: ${req.file.originalname} (${fileSizeMB} MB)`);

    // Upload with retries (entire file at once)
    const uploadUrl = await retry(() => uploadBufferToAssemblyAI(buffer), { 
      retries: 3, 
      baseDelay: 1000 
    });
    console.log("✅ Uploaded to AssemblyAI");

    // Create transcript job (with retries)
    const transcriptJob = await retry(() => createTranscript(uploadUrl), { 
      retries: 3, 
      baseDelay: 500 
    });
    console.log(`🎯 Transcript job created: ${transcriptJob.id}`);

    // Return the transcript ID immediately and let frontend poll
    return res.json({
      success: true,
      transcriptionId: transcriptJob.id,
      status: transcriptJob.status,
    });

  } catch (err) {
    console.error("❌ AssemblyAI Error:", err?.response?.status, err?.response?.data || err.message);
    const message = err?.response?.data?.error || err.message || "Transcription failed";
    return res.status(500).json({ success: false, error: message });
  }
});

// Status endpoint for polling - ENHANCED to save to DB when complete
router.get("/status/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // From auth middleware
    
    const result = await getTranscriptStatus(id);
    
    console.log(`📊 Status check for ${id}: ${result.status}`);

    if (result.status === "completed") {
      // Check if already saved to avoid duplicates using transcriptionId
      const existingMeeting = await prisma.meeting.findUnique({
        where: { 
          transcriptionId: id  // Query by transcriptionId, not MongoDB _id
        }
      });

      let meetingId = existingMeeting?.id;

      if (!existingMeeting) {
        console.log("💾 Saving to database...");
        
        // Generate metadata using Gemini
        console.log("🤖 Generating metadata with Gemini...");
        const metadata = await generateMeetingMetadata(
          result.summary || "No summary available",
          result.text || "No transcript available"
        );
        
        console.log("✨ Generated metadata:", metadata);

        // Save to database
        const meeting = await prisma.meeting.create({
          data: {
            transcriptionId: id,  // Store AssemblyAI UUID
            title: metadata.title,
            label: metadata.label,
            time: formatDuration(result.audio_duration || 0),
            userId: userId,
            shortSummary: metadata.shortSummary,
            LongSummary: result.summary || "No summary available",
            transcript: result.text || "No transcript available",
          },
        });

        meetingId = meeting.id;
        console.log("✅ Saved to database with ID:", meeting.id);
      }

      return res.json({
        success: true,
        status: "completed",
        transcriptionId: id,
        meetingId: meetingId, // Return the database ID
        text: result.text,
        summary: result.summary,
        utterances: result.utterances,
        audio_duration: result.audio_duration,
      });
      
    } else if (result.status === "error") {
      return res.json({
        success: false,
        status: "error",
        error: result.error,
      });
    } else {
      return res.json({
        success: true,
        status: result.status, // "queued" or "processing"
        transcriptionId: id,
      });
    }
  } catch (err) {
    console.error("❌ Status check error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to check status",
    });
  }
});

// Get meeting details from database
router.get("/meeting/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by MongoDB ObjectId first, then by transcriptionId
    let meeting = null;
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      meeting = await prisma.meeting.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      });
    }
    
    // If not found, try by transcriptionId (AssemblyAI UUID)
    if (!meeting) {
      meeting = await prisma.meeting.findUnique({
        where: { transcriptionId: id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      });
    }

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: "Meeting not found",
      });
    }

    return res.json({
      success: true,
      meeting,
    });
    
  } catch (err) {
    console.error("❌ Get meeting error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to retrieve meeting",
    });
  }
});

// Get all meetings for a user
router.get("/meetings", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const meetings = await prisma.meeting.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        label: true,
        time: true,
        shortSummary: true,
        createdAt: true,
      }
    });

    return res.json({
      success: true,
      meetings,
    });
    
  } catch (err) {
    console.error("❌ Get meetings error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to retrieve meetings",
    });
  }
});

export default router;