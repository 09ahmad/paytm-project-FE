interface PropType {
  label: string
}

export default function Heading({ label }: PropType) {
  return <div className="font-bold text-4xl pt-6">
    {label}
  </div>
}
