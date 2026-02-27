"use client";

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
    <div style={{ maxWidth: 520 }}>
      <h1>New member</h1>

      <form onSubmit={onSubmit}>
        <label style={{ display: "block", marginTop: 12 }}>
          First name
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Last name
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Email (optional)
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Phone (optional)
          <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6 }} />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} style={{ width: "100%", padding: 8, marginTop: 6 }}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </label>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button disabled={saving} style={{ marginTop: 16, padding: "10px 12px" }}>
          {saving ? "Saving..." : "Create member"}
        </button>
      </form>
    </div>
  );
}
