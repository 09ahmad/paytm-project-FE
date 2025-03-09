export default function InputBox({ label, placeholder ,onChange}: {
  label: string,
  placeholder: string,
  onChange:React.ChangeEventHandler<HTMLInputElement>
}) {
  return <div>
    <div className="text-sm font-md text-left py-2">
      {label}
    </div>
    <input placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200"
     onChange={onChange} />
  </div>
}
