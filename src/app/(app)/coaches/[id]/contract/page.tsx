type Props = {
  params: Promise<{ id: string }>;
};

export default async function ContractPage({ params }: Props) {
  const { id } = await params;

  return <div>Contract ID: {id}</div>;
}