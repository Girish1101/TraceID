"use client";

import { useState, useCallback } from "react";
import { Upload, Camera, FileImage, AlertCircle } from "lucide-react";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  sublabel?: string;
  currentPreview?: string | null;
  onClearPreview?: () => void;
  error?: string | null;
  className?: string;
}

export default function DropZone({
  onFileSelect,
  accept = "image/*",
  maxSizeMB = 10,
  label = "Drop a clear photo or click to browse",
  sublabel = "Supports JPG, PNG, WEBP — single person or crowd photos",
  currentPreview = null,
  onClearPreview,
  error = null,
  className = "",
}: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className={`w-full font-sans ${className}`}>
      <label className="block cursor-pointer">
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          id="dropzone-input"
        />

        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed p-8 text-center transition-all duration-200 rounded-xs flex flex-col items-center justify-center min-h-[220px] ${
            isDragActive
              ? "border-[#C68E3F] bg-[#C68E3F]/10 scale-[1.005]"
              : error
              ? "border-[#A63A2E] bg-[#A63A2E]/5"
              : "border-[#C9C2B2] bg-[#F7F5F0] hover:border-[#C68E3F] hover:bg-[#EFEAE0]/80"
          }`}
        >
          {/* Caliper crop corner accents */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#C9C2B2]" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#C9C2B2]" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#C9C2B2]" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#C9C2B2]" />

          {currentPreview ? (
            <div className="relative group flex flex-col items-center">
              <div className="relative w-44 h-44 bg-[#EFEAE0] border border-[#C9C2B2] p-1 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPreview}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {onClearPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClearPreview();
                  }}
                  className="mt-3 px-3 py-1 bg-[#171A1F] text-[#EDE9DF] font-mono text-xs uppercase tracking-wider hover:bg-[#A63A2E] transition-colors rounded-xs"
                >
                  [ Change Image ]
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#EFEAE0] border border-[#C9C2B2] flex items-center justify-center mb-3 text-[#C68E3F]">
                <Camera className="w-6 h-6" />
              </div>

              <p className="text-sm font-semibold text-[#171A1F] mb-1">
                {isDragActive ? "Release photo to upload" : label}
              </p>

              <p className="text-xs text-[#5B6472] font-mono">
                {sublabel}
              </p>

              <span className="mt-4 px-4 py-1.5 bg-[#C68E3F] hover:bg-[#9C6B27] text-[#10151F] font-mono font-semibold text-xs tracking-wider uppercase transition-colors rounded-xs">
                Select Photo File
              </span>
            </>
          )}
        </div>
      </label>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#A63A2E] font-mono">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
