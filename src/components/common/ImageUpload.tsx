"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  currentImageUrl?: string;
  bucket?: string;
  maxSize?: number; // in MB
}

export default function ImageUpload({
  onUploadSuccess,
  onUploadError,
  currentImageUrl,
  bucket = "profile-avatars",
  maxSize = 5,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFile = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      onUploadError?.(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      onUploadError?.("Please upload an image file");
      return;
    }

    setLoading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;
      const filePath = `${bucket}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;
      onUploadSuccess(publicUrl);
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : "Upload failed");
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full">
      {/* Preview */}
      {previewUrl && (
        <div className="mb-4 relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 rounded-lg object-cover border border-gray-300"
            loading="lazy"
          />
          {loading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={loading}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          {loading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              {loading ? "Uploading..." : "Drag and drop your image here"}
            </p>
            <p className="text-xs text-gray-500">or click to select</p>
            <p className="text-xs text-gray-400 mt-1">
              Max size: {maxSize}MB • PNG, JPG, GIF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
