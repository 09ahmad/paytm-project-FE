export default function InputBox({
  label,
  placeholder,
  onChange,
  value,
  type = "text",
}: {
  label: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  type?: string;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2 text-foreground">
        {label}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-input rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
        onChange={onChange}
        value={value}
      />
    </div>
  );
}
