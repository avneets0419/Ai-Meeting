import express from "express";
import fetch from "node-fetch";
import multer from "multer"; // ✅ needed to parse FormData
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const upload = multer(); // ✅ in-memory file upload

// Step 1: Upload audio to AssemblyAI
async function uploadAudio(fileBuffer) {
  const response = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY,
      "transfer-encoding": "chunked",
    },
    body: fileBuffer,
  });
  const data = await response.json();
  console.log("🎧 Upload response:", data);
  return data.upload_url;
}

// Step 2: Start transcription
async function startTranscription(audioUrl) {
  const response = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      speaker_labels: true,
      auto_highlights: true,
      summarization: true,
      summary_model: "informative",
      summary_type: "paragraph",
    }),
  });
  const data = await response.json();
  console.log("🧾 Transcription started:", data);
  return data;
}

// Step 3: Check transcription status
router.get("/status/:id", async (req, res) => {
  const { id } = req.params;
  const response = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
    headers: { authorization: process.env.ASSEMBLYAI_API_KEY },
  });
  const data = await response.json();
  res.json(data);
});

// ✅ Step 4: Upload file + start transcription
router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("❌ No file found in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📦 File received:", req.file.originalname, req.file.size, "bytes");

    const uploadUrl = await uploadAudio(req.file.buffer);
    const job = await startTranscription(uploadUrl);

    res.json({ message: "Transcription started", id: job.id });
  } catch (err) {
    console.error("❌ Transcription error:", err);
    res.status(500).json({ error: "Failed to start transcription" });
  }
});

export default router;
