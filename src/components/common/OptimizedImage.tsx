"use client";

import React, { useState, useEffect } from "react";
import NextImage from "next/image";

interface OptimizedImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  loading?: "lazy" | "eager";
}

const DEFAULT_FALLBACK = "https://ui-avatars.com/api/?background=1A4FD6&color=fff&size=128&name=User";

export default function OptimizedImage({
  src,
  alt,
  width = 48,
  height = 48,
  className = "",
  fallback = DEFAULT_FALLBACK,
  loading = "lazy",
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src || fallback);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImageSrc(src || fallback);
    setIsLoading(true);
  }, [src, fallback]);

  const handleError = () => {
    setImageSrc(fallback);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{ width, height, minWidth: width, minHeight: height }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <NextImage
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
