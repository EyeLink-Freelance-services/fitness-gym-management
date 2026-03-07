"use client";

import React from "react";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm",
        "outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm",
        "outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm",
        "outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Button({
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-black/90"
      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50";

  return <button {...props} className={[base, styles, props.className ?? ""].join(" ")} />;
}