"use client";

import { useState } from "react";

export default function MemberActions({ id, member }: { id: string; member: any }) {
  const [status, setStatus] = useState<"active" | "inactive">(member.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json?.error ?? "Failed to update");
      setSaving(false);
      return;
    }

    window.location.reload();
  }

  async function remove() {
    if (!confirm("Delete this member?")) return;

    const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      alert(json?.error ?? "Failed to delete");
      return;
    }
    window.location.href = "/members";
  }

  return (
    <div>
      <h2>Actions</h2>

      <label style={{ display: "block", marginTop: 12 }}>
        Status
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          style={{ width: 240, padding: 8, marginTop: 6 }}
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
      </label>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={save} disabled={saving} style={{ padding: "8px 12px" }}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={remove} style={{ padding: "8px 12px" }}>
          Delete
        </button>
      </div>
    </div>
  );
}
