"use client";

import { useEffect, useRef, useState } from "react";
import Label from "./common/label";
import { Button } from "../ui-elements/button";

export type ImageUploadProps = {
  label: string;
  optional?: boolean;
  accept?: string;
  initialPreviewUrl?: string;
  emptyStateText?: React.ReactNode;
  hint?: string;
  error?: string;
  onFileChange: (file: File | null) => void;
};

export function ImageUpload({
  label,
  optional,
  accept = "image/*",
  initialPreviewUrl,
  emptyStateText = (
    <>
      Drop your image here or <strong>browse files</strong>
    </>
  ),
  hint = "PNG, JPG, SVG - max 5MB",
  error,
  onFileChange,
}: ImageUploadProps) {
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const setFile = (file: File | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    const nextUrl = file ? URL.createObjectURL(file) : null;
    previewUrlRef.current = nextUrl;
    setPreviewFile(file);
    setPreviewUrl(nextUrl);
    onFileChange(file);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const resolvedPreviewUrl = previewUrl ?? initialPreviewUrl ?? null;

  return (
    <div className="mb-5">
      <Label value={label} optional={optional} />
      <div
        className={`cursor-pointer rounded-lg border border-dashed p-6 text-center transition ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-stroke bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) setFile(file);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {resolvedPreviewUrl ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={resolvedPreviewUrl}
                alt="Preview"
                className="h-20 w-20 rounded-lg object-cover"
              />
              <p className="truncate text-body-sm font-medium text-dark dark:text-white">
                {previewFile?.name ?? "Current image"}
              </p>
            </div>
            <Button
              type="button"
              label="Remove"
              variant="outlineDark"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            />
          </div>
        ) : (
          <>
            <p className="text-body-sm text-dark-5 dark:text-dark-6">
              {emptyStateText}
            </p>
            {hint && (
              <p className="mt-1 text-body-xs text-dark-5 dark:text-dark-6">
                {hint}
              </p>
            )}
          </>
        )}
      </div>
      {error && <p className="mt-1 text-body-sm text-red-500">{error}</p>}
    </div>
  );
}
