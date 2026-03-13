type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center p-6">
      <div className="max-w-md rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}