"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  PaperclipIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";

export default function UploadFile() {
  const router = useRouter();
  const maxSize = 70 * 1024 * 1024; // 70MB limit
  const [uploading, setUploading] = useState(false);
  const [transcriptionId, setTranscriptionId] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState("");

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({ maxSize });

  const file = files[0]?.file;

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    // Get JWT token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (!token) {
      setMessage("Please login to upload files");
      return;
    }
  
    setUploading(true);
    setMessage("");
    setProgress("Uploading file...");
    setTranscriptionId(null);
  
    try {
      const formData = new FormData();
      formData.append("audio", file);
  
      const res = await fetch(`http://localhost:8080/api/transcribe/transcribe`, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Alternative header format if your backend uses this:
          // 'x-auth-token': token,
        },
      });
  
      const data = await res.json();
  
      if (data.success && data.transcriptionId) {
        setTranscriptionId(data.transcriptionId);
        setProgress("Transcription queued. Processing...");
        
        // Poll for transcription status
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(
              `http://localhost:8080/api/transcribe/status/${data.transcriptionId}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              }
            );
            const statusData = await statusRes.json();
            
            console.log("Status:", statusData.status);
            
            if (statusData.status === "completed") {
              clearInterval(pollInterval);
              setProgress("Generating summary with AI...");
              
              // Wait a moment to ensure DB save is complete
              setTimeout(() => {
                console.log("✅ Transcription completed!");
                console.log("Meeting ID:", statusData.meetingId);
                console.log("Audio Duration:", statusData.audio_duration, "seconds");
                
                setProgress("");
                setMessage("Transcription completed! Redirecting...");
                setUploading(false);
                
                // Redirect to meeting details page
                if (statusData.meetingId) {
                  router.push(`dashboard/summaries/${statusData.meetingId}`);
                } else {
                  setMessage("Meeting saved! Please refresh to see it.");
                }
              }, 2000);
              
            } else if (statusData.status === "error") {
              clearInterval(pollInterval);
              setProgress("");
              setMessage("Error: " + (statusData.error || "Transcription failed"));
              setUploading(false);
            } else {
              // Update progress message based on status
              if (statusData.status === "queued") {
                setProgress("Waiting in queue...");
              } else if (statusData.status === "processing") {
                setProgress("Processing transcription...");
              } else {
                setProgress(`Status: ${statusData.status}...`);
              }
            }
          } catch (err) {
            console.error("Polling error:", err);
            clearInterval(pollInterval);
            setProgress("");
            setMessage("Failed to check status");
            setUploading(false);
          }
        }, 3000); // Poll every 3 seconds
        
      } else {
        setMessage("Error: " + (data.error || "Upload failed"));
        setUploading(false);
      }
  
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Upload failed: " + err.message);
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="
          flex min-h-40 flex-col items-center justify-center
          rounded-xl border border-dashed border-input p-4
          transition-colors hover:bg-neutral-50 dark:hover:bg-card
          data-[dragging=true]:bg-accent/50
        "
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload file"
          disabled={Boolean(file) || uploading}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
            aria-hidden="true"
          >
            <UploadIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload file</p>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to browse (max. {formatBytes(maxSize)})
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="flex items-center justify-center gap-1 text-xs text-destructive" role="alert">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {file && (
        <div className="space-y-2">
          <div
            key={file.name}
            className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <PaperclipIcon className="size-4 shrink-0 opacity-60" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">
                  {file.name}
                </p>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove file"
              disabled={uploading}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {file && (
        <Button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-3 w-full bg-white text-black hover:bg-white/80"
        >
          {uploading ? "Processing..." : "Start Transcription"}
        </Button>
      )}

      {progress && (
        <p className="text-sm text-center text-blue-500 mt-2 animate-pulse">{progress}</p>
      )}

      {message && (
        <p className={`text-sm text-center mt-2 ${message.includes("completed") ? "text-green-500" : "text-gray-400"}`}>
          {message}
        </p>
      )}
      
      {transcriptionId && (
        <p className="text-xs text-center text-green-500">
          Transcription ID: {transcriptionId}
        </p>
      )}
    </div>
  );
}