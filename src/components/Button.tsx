interface PropType {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({ label, onClick, disabled = false }: PropType) {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className={`w-full text-primary-foreground font-medium rounded-xl text-sm px-5 py-2.5 transition-all duration-200 ${
        disabled
          ? "bg-muted cursor-not-allowed opacity-50"
          : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-4 focus:ring-ring/50 active:scale-95 shadow-md hover:shadow-lg glow-primary"
      }`}
    >
      {label}
    </button>
  );
}
