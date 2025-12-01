// routes/transcribe.js
import express from "express";
import multer from "multer";
import axios from "axios";
import https from "https";

const router = express.Router();
const upload = multer(); // memory storage

// Config
const ASSEMBLYAI_KEY = process.env.ASSEMBLYAI_API_KEY;
if (!ASSEMBLYAI_KEY) {
  console.error("ERROR: set ASSEMBLYAI_API_KEY env var before starting server");
  process.exit(1);
}

const UPLOAD_ENDPOINT = "https://api.assemblyai.com/v2/upload";
const TRANSCRIPT_ENDPOINT = "https://api.assemblyai.com/v2/transcript";

// Keep-alive agent to reduce socket churn
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 10 });

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

// Upload buffer to AssemblyAI using axios (chunked streaming)
async function uploadBufferToAssemblyAI(buffer) {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
  let uploadUrl = "";

  for (let start = 0; start < buffer.length; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE, buffer.length);
    const chunk = buffer.slice(start, end);

    const res = await axios({
      method: "POST",
      url: UPLOAD_ENDPOINT,
      headers: {
        authorization: ASSEMBLYAI_KEY,
        "Content-Type": "application/octet-stream",
        "Content-Range": `bytes ${start}-${end - 1}/${buffer.length}`,
      },
      data: chunk,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      httpsAgent,
    });

    uploadUrl = res.data.upload_url;
  }

  return uploadUrl;
}



// Request transcription
async function createTranscript(upload_url) {
  const body = {
    audio_url: upload_url,
    summarization: true,
    summary_model: "informative",
    summary_type: "paragraph",
    // add other options you need
  };

  const res = await axios.post(TRANSCRIPT_ENDPOINT, body, {
    headers: {
      Authorization: ASSEMBLYAI_KEY,
      "Content-Type": "application/json",
    },
    httpsAgent,
    timeout: 60000,
  });

  return res.data; // contains id
}

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No audio file uploaded" });
    }

    const buffer = req.file.buffer;
    console.log(`Received file ${req.file.originalname} (${buffer.length} bytes)`);

    // Upload with retries
    const uploadUrl = await retry(() => uploadBufferToAssemblyAI(buffer), { retries: 5, baseDelay: 500 });
    console.log("Uploaded to AssemblyAI, upload_url:", uploadUrl);

    // Create transcript job (with retries)
    const transcriptJob = await retry(() => createTranscript(uploadUrl), { retries: 4, baseDelay: 500 });
    console.log("Transcript created:", transcriptJob.id);

    // Poll for completion (simple polling)
    const pollUrl = `${TRANSCRIPT_ENDPOINT}/${transcriptJob.id}`;
    let finalResult;
    while (true) {
      const statusRes = await axios.get(pollUrl, {
        headers: { Authorization: ASSEMBLYAI_KEY },
        httpsAgent,
        timeout: 30000,
      });
      const status = statusRes.data.status;
      console.log(`Polling status: ${status}`);
      if (status === "completed") {
        finalResult = statusRes.data;
        break;
      }
      if (status === "error") {
        console.error("Transcript error:", statusRes.data);
        return res.status(500).json({ success: false, error: "Transcription failed", details: statusRes.data });
      }
      // wait a bit
      await new Promise((r) => setTimeout(r, 3000));
    }

    // Return result
    return res.json({
      success: true,
      text: finalResult.text,
      summary: finalResult.summary,
      transcriptId: finalResult.id,
      raw: finalResult,
    });
  } catch (err) {
    console.error("AssemblyAI Error (detailed):", err?.response?.status, err?.response?.data || err.stack || err.message);
    const message = err?.response?.data?.error || err.message || "Transcription failed";
    return res.status(500).json({ success: false, error: message });
  }
});

export default router;
