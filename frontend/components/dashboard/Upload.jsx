"use client";
import React, { useState } from "react";
import {
  AlertCircleIcon,
  PaperclipIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";

export default function UploadFile() {
  const maxSize = 25 * 1024 * 1024; // 25MB limit
  const [uploading, setUploading] = useState(false);
  const [transcriptionId, setTranscriptionId] = useState(null);
  const [message, setMessage] = useState("");

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

    const formData = new FormData();
    formData.append("audio", file); // 👈 this must match upload.single("audio") in backend

    try {
      setUploading(true);
      setMessage("Uploading and starting transcription...");

      const res = await fetch("http://localhost:8080/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setTranscriptionId(data.id);
        setMessage("✅ Transcription started successfully!");
        console.log("🎧 AssemblyAI response:", data);
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to start transcription"}`);
        console.error("Upload error:", data);
      }
    } catch (err) {
      console.error("Error uploading:", err);
      setMessage("❌ Upload failed. Check console for details.");
    } finally {
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
          disabled={Boolean(file)}
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
          {uploading ? "Uploading..." : "Start Transcription"}
        </Button>
      )}

      {message && (
        <p className="text-sm text-center text-gray-400 mt-2">{message}</p>
      )}
      {transcriptionId && (
        <p className="text-xs text-center text-green-500">
          Transcription ID: {transcriptionId}
        </p>
      )}
    </div>
  );
}
