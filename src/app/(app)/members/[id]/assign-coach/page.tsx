// placeholder
// placeholder
type Props = {
  params: Promise<{ id: string }>;
};

export default async function AssignPage({ params }: Props) {
  const { id } = await params;

  return <div>Assign ID: {id}</div>;
}