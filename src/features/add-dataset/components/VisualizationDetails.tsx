import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectDomain } from "../SelectDomain"
import type { Domain } from "@/constants/dataset/dataset.types"

interface VisualizationDetailsProps {
  title: string
  domain: Domain | null
  onTitleChange: (value: string) => void
  onDomainChange: (value: Domain | null) => void
}

export function VisualizationDetails({
  title,
  domain,
  onTitleChange,
  onDomainChange,
}: VisualizationDetailsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="chart-title">
          Chart Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="chart-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Temperature Trend"
          aria-invalid={!title.trim()}
        />
        <p className="text-xs text-muted-foreground">This title will be displayed on the public visualization.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="chart-domain">Domain</Label>
        <SelectDomain value={domain} onChange={onDomainChange} id="chart-domain" />
        <p className="text-xs text-muted-foreground">The section of the public site this visualization belongs in.</p>
      </div>
    </div>
  )
}