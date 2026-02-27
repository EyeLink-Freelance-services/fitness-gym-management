export default async function MembersPage() {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/members`, {
  //   // Important for server components:
  //   cache: "no-store",
  // });

  // // If NEXT_PUBLIC_BASE_URL isn't set, Next will use relative fetch on server in most cases,
  // // but some deployments need an absolute URL. You can set NEXT_PUBLIC_BASE_URL to your site origin.
  // const json = await res.json();
  const members: any[] = [];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Members</h1>
        <a href="/members/new">+ New member</a>
      </div>

      {members.length === 0 ? (
        <p>No members yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Email</th>
              <th align="left">Phone</th>
              <th align="left">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m: any) => (
              <tr key={m.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "10px 0" }}>
                  <a href={`/members/${m.id}`}>{m.first_name} {m.last_name}</a>
                </td>
                <td>{m.email ?? "-"}</td>
                <td>{m.phone ?? "-"}</td>
                <td>{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
