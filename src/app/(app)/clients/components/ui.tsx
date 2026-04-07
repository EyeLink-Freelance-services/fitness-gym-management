"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type MemberStatus = "active" | "inactive";

export default function MemberActions({
  id,
  member,
}: {
  id: string;
  member: any;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<MemberStatus>(
    (member.status as MemberStatus) ?? "active",
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    try {
      setSaving(true);
      setError(null);

      const res = await fetch(`/api/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json?.error ?? "Failed to update member.");
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong while updating this member.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError(null);

      const res = await fetch(`/api/members/${id}`, {
        method: "DELETE",
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json?.error ?? "Failed to delete member.");
        return;
      }

      router.push("/members");
      router.refresh();
    } catch {
      setError("Something went wrong while deleting this member.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
          Status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as MemberStatus)}
          disabled={saving || deleting}
          className="h-11 w-full rounded-xl border border-stroke bg-white px-4 text-sm font-medium text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={save}
          disabled={saving || deleting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          onClick={remove}
          disabled={saving || deleting}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:bg-dark-2 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          {deleting ? "Deleting..." : "Delete member"}
        </button>
      </div>
    </div>
  );
}