type Props = {
  params: Promise<{ id: string }>;
};

export default async function RemindersPage({ params }: Props) {
  const { id } = await params;

  return <div>Reminders ID: {id}</div>;
}