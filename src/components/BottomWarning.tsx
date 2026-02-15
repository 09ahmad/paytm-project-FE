import { Link } from "react-router-dom";

export default function ButtonWarning({ label, buttonText, to }: { label: string, buttonText: string, to: string }) {
  return (
    <div className="py-2 text-sm flex justify-center items-center gap-1 text-muted-foreground">
      <div>
        {label}
      </div>
      <Link 
        className="pointer underline pl-1 cursor-pointer text-primary hover:text-primary/80 transition-colors font-medium" 
        to={to}
      >
        {buttonText}
      </Link>
    </div>
  );
}
