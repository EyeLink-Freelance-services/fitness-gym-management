// placeholder
type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContractPage({ params }: Props) {
  const { id } = await params;

  return <div>Contract for ID: {id}</div>;
}