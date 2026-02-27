type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProgressPage({ params }: Props) {
  const { id } = await params;

  return <div>Progress ID: {id}</div>;
}