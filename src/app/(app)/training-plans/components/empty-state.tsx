type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center p-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-stroke/70 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/80">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
          📋
        </div>
        
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-dark-5 dark:text-dark-6">
          {description}
        </p>

        <p className="mt-4 text-xs text-dark-5 dark:text-dark-6">
          Start by creating a new session on the left panel
        </p>
      </div>
    </div>
  );
}