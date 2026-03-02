import { FormHeader } from "@/types/forms";

const header = ({ label, title, subtitle }: FormHeader) => {
  return (
    <div className="panel-header">
      <p className="panel-label">{label}</p>
      <h2 className="panel-title">{title}</h2>
      <p className="panel-sub">{subtitle}</p>
    </div>
  );
};

export default header;
