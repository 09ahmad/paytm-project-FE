export default function SubHeading({ label }: { label: string }) {
  return (
    <div className="text-muted-foreground text-sm pt-1 pb-2">
      {label}
    </div>
  );
}
