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
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

export default function UploadFile() {
  const router = useRouter();
  const maxSize = 70 * 1024 * 1024; // 70MB limit
  const [uploading, setUploading] = useState(false);
  const [transcriptionId, setTranscriptionId] = useState(null);
  const [message, setMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

  // Loading states for MultiStepLoader
  const loadingStates = [
    { text: "Uploading your audio file..." },
    { text: "File uploaded successfully" },
    { text: "Transcription queued" },
    { text: "Processing transcription..." },
    { text: "Generating AI summary..." },
    { text: "Creating meeting title and labels..." },
    { text: "Saving to database..." },
    { text: "Complete! Redirecting..." },
  ];

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
    setCurrentStep(0);
    setTranscriptionId(null);
  
    try {
      const formData = new FormData();
      formData.append("audio", file);
  
      const res = await fetch(`${API_URL}/api/transcribe/transcribe`, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
  
      if (data.success && data.transcriptionId) {
        setCurrentStep(1); // File uploaded successfully
        setTranscriptionId(data.transcriptionId);
        
        setTimeout(() => setCurrentStep(2), 500); // Transcription queued
        
        // Poll for transcription status
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(
              `${API_URL}/api/transcribe/status/${data.transcriptionId}`,
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
              
              // Progress through AI generation steps
              setCurrentStep(4); // Generating AI summary
              
              setTimeout(() => {
                setCurrentStep(5); // Creating title and labels
              }, 1000);
              
              setTimeout(() => {
                setCurrentStep(6); // Saving to database
              }, 2000);
              
              setTimeout(() => {
                setCurrentStep(7); // Complete!
                console.log("✅ Transcription completed!");
                console.log("Meeting ID:", statusData.meetingId);
                console.log("Audio Duration:", statusData.audio_duration, "seconds");
                
                setMessage("Transcription completed! Redirecting...");
                
                // Redirect to meeting details page
                setTimeout(() => {
                  if (statusData.meetingId) {
                    router.push(`/dashboard/summaries/${statusData.meetingId}`);
                  } else {
                    setMessage("Meeting saved! Please refresh to see it.");
                    setUploading(false);
                  }
                }, 1000);
              }, 3000);
              
            } else if (statusData.status === "error") {
              clearInterval(pollInterval);
              setMessage("Error: " + (statusData.error || "Transcription failed"));
              setUploading(false);
            } else {
              // Update step based on status
              if (statusData.status === "queued" && currentStep < 3) {
                setCurrentStep(2);
              } else if (statusData.status === "processing" && currentStep < 4) {
                setCurrentStep(3);
              }
            }
          } catch (err) {
            console.error("Polling error:", err);
            clearInterval(pollInterval);
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
    <>
      {/* Multi-step loader overlay */}
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={uploading}
        duration={2000}
        loop={false}
        value={currentStep}
      />

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

        {message && !uploading && (
          <p className={`text-sm text-center mt-2 ${message.includes("completed") ? "text-green-500" : "text-gray-400"}`}>
            {message}
          </p>
        )}
        
        {transcriptionId && !uploading && (
          <p className="text-xs text-center text-green-500">
            Transcription ID: {transcriptionId}
          </p>
        )}
      </div>
    </>
  );
}