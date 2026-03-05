"use client";

import ClientForm from "@/components/Forms/ClientForm";
import { useState } from "react";

export default function NewMemberPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        status,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json?.error ?? "Failed to create member");
      setSaving(false);
      return;
    }

    window.location.href = `/members/${json.member.id}`;
  }

  return (
    <div className="max-w-2xl">
      <ClientForm />
    </div>
  );
}
