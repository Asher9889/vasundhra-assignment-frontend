import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Domain } from "@/types"
import { domainLabels } from "@/lib/format"

interface SelectDomainProps {
  value: Domain | null
  onChange: (value: Domain | null) => void
  id?: string
}

export function SelectDomain({ value, onChange, id }: SelectDomainProps) {
  const [internal, setInternal] = useState<Domain | "">(value ?? "")

  useEffect(() => {
    if (value === null) setInternal("")
  }, [value])

  return (
    <Select
      value={internal}
      onValueChange={(v) => {
        setInternal(v as Domain)
        onChange(v as Domain)
      }}
    >
      <SelectTrigger className="w-full" id={id} aria-label="Domain">
        <SelectValue placeholder="Select a domain" />
      </SelectTrigger>
      <SelectContent>
        {(["climate", "energy", "power"] as const).map((d) => (
          <SelectItem key={d} value={d}>
            {domainLabels[d]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}