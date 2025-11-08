"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { extractTextFromPdf } from "@/lib/pdf";
import type { LessonPlan } from "@/types/lesson";

interface FileUploadProps {
  onLessonGenerated: (lesson: LessonPlan) => void;
  onProcessingChange: (processing: boolean) => void;
  onError: (message: string | null) => void;
}

export function FileUpload({
  onLessonGenerated,
  onProcessingChange,
  onError,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) {
        return;
      }
      if (file.type !== "application/pdf") {
        onError("Please upload a PDF file.");
        return;
      }

      onProcessingChange(true);
      onError(null);

      try {
        const text = await extractTextFromPdf(file);
        if (!text.trim()) {
          throw new Error("Unable to extract text from the selected PDF.");
        }

        const response = await fetch("/api/generate-lesson", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pdfText: text }),
        });

        if (!response.ok) {
          const details = await response.text();
          throw new Error(details || "Failed to generate lesson plan.");
        }

        const lesson = (await response.json()) as LessonPlan;
        onLessonGenerated(lesson);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while generating the lesson.";
        onError(message);
      } finally {
        onProcessingChange(false);
      }
    },
    [onError, onLessonGenerated, onProcessingChange]
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      void handleFile(file);
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0] ?? null;
      void handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const triggerFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40"
            : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          Upload a lesson PDF to begin
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Drag and drop your file here, or
        </p>
        <button
          type="button"
          onClick={triggerFileDialog}
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Choose PDF
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
