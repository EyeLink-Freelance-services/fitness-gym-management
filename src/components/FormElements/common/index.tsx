import { FormHeader } from "@/types/forms";

export const Header = ({ label, title, subtitle }: FormHeader) => {
  return (
    <div className="panel-header">
      <p className="panel-label">{label}</p>
      <h2 className="panel-title">{title}</h2>
      <p className="panel-sub">{subtitle}</p>
    </div>
  );
};

export const HeaderTitle = ({ title }: { title: string }) => {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
      <span className="text-body-xs font-medium uppercase tracking-wider text-dark-5 dark:text-dark-6">
        {title}
      </span>
      <div className="h-px flex-1 bg-stroke dark:bg-dark-3" />
    </div>
  );
};
