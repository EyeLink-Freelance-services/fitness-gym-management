"use client";

import { useEffect, useRef, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
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
  registerReturn: UseFormRegisterReturn;
  setValue: (name: string, value: FileList | undefined) => void;
};

export function ImageUpload({
  label,
  optional,
  accept = "image/*",
  initialPreviewUrl,
  emptyStateText = (
    <>
      Drop your image here or{" "}
      <strong className="text-dark dark:text-white">browse files</strong>
    </>
  ),
  hint = "PNG, JPG, SVG - max 5MB",
  error,
  registerReturn,
  setValue,
}: ImageUploadProps) {
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingPreviewUrl, setExistingPreviewUrl] = useState<string | null>(
    initialPreviewUrl ?? null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { ref, onChange, name, ...rest } = registerReturn;

  const triggerRegisteredChange = (files?: FileList) => {
    onChange({
      target: { files, name },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  useEffect(() => {
    setExistingPreviewUrl(initialPreviewUrl ?? null);
  }, [initialPreviewUrl]);

  const validateAndSetFile = (file: File) => {
    setPreviewFile(file);
    const dt = new DataTransfer();
    dt.items.add(file);
    setValue(name, dt.files);
    triggerRegisteredChange(dt.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (previewFile) {
      const url = URL.createObjectURL(previewFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [previewFile]);

  const resolvedPreviewUrl = previewUrl ?? existingPreviewUrl;
  const resolvedPreviewLabel =
    previewFile?.name ??
    existingPreviewUrl?.split("/").pop()?.split("?")[0] ??
    "Current image";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    const file = e.target.files?.[0];
    setValue(name, e.target.files ?? undefined);
    setPreviewFile(file ?? null);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerRegisteredChange(undefined);
    setValue(name, undefined);
    setPreviewFile(null);
    setExistingPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mb-5">
      <Label value={label} optional={optional} />
      <div
        className={`cursor-pointer rounded-lg border border-dashed p-6 text-center transition ${
          isDragging
            ? "border-primary bg-primary/5 dark:border-primary dark:bg-primary/10"
            : "border-stroke bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary"
        }`}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-image-upload-action]")) {
            return;
          }
          const target = e.currentTarget.querySelector(
            "input",
          ) as HTMLInputElement;
          target?.click();
        }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          accept={accept}
          className="hidden"
          {...rest}
          ref={(el) => {
            ref(el);
            fileInputRef.current = el;
          }}
          onChange={handleFileChange}
        />
        {resolvedPreviewUrl ? (
          <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              {resolvedPreviewUrl ? (
                <img
                  src={resolvedPreviewUrl}
                  alt="Preview"
                  className="h-20 w-20 rounded-lg object-cover"
                />
              ) : (
                <div className="h-20 w-20 animate-pulse rounded-lg bg-gray-2 dark:bg-dark-3" />
              )}
              <p className="max-w-[30%] truncate text-body-sm font-medium text-dark dark:text-white">
                {resolvedPreviewLabel}
              </p>
            </div>
            <Button
              type="button"
              label="Remove"
              variant="outlineDark"
              size="small"
              data-image-upload-action="remove"
              onClick={clearImage}
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
      {error && (
        <p className="mt-1 text-body-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
