import MemberActions from "../components/ui";

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(`/api/members/${id}`, { cache: "no-store" });
  const json = await res.json();

  if (!res.ok) {
    return (
      <div>
        <h1>Member</h1>
        <p>Not found.</p>
        <a href="/members">Back</a>
      </div>
    );
  }

  const m = json.member;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{m.first_name} {m.last_name}</h1>
        <a href="/members">Back</a>
      </div>

      <p><strong>Status:</strong> {m.status}</p>
      <p><strong>Email:</strong> {m.email ?? "-"}</p>
      <p><strong>Phone:</strong> {m.phone ?? "-"}</p>

      <hr style={{ margin: "16px 0" }} />

      <MemberActions id={id} member={m} />
    </div>
  );
}
