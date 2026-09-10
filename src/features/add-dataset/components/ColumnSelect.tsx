import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ColumnSelectProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  id?: string
}

export function ColumnSelect({ label, value, options, onChange, id }: ColumnSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
        <SelectTrigger className="w-full cursor-pointer" id={id}>
          <SelectValue placeholder="Select a column" />
        </SelectTrigger>
        <SelectContent>
          {options.map((name) => (
            <SelectItem className="cursor-pointer" key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}