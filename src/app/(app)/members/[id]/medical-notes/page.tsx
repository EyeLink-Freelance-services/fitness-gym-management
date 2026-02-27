type Props = {
  params: Promise<{ id: string }>;
};

export default async function MedicalNotePage({ params }: Props) {
  const { id } = await params;

  return <div>Editing ID: {id}</div>;
}