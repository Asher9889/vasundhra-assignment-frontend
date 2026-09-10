import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DOMAIN } from "@/constants/dataset/dataset.constants"
import type { Domain } from "@/constants/dataset/dataset.types"
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
      <SelectTrigger className="w-full cursor-pointer" id={id} aria-label="Domain">
        <SelectValue placeholder="Select a domain" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(DOMAIN).map((d) => (
          <SelectItem className="cursor-pointer" key={d} value={d}>
            {domainLabels[d]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}