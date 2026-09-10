import { CalendarDays, Hash, Type } from "lucide-react"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ColumnType, ParsedCSV } from "../types/add-dataset.types"
import { StepSection } from "./StepSection"

interface SchemaTableProps {
  parsed: ParsedCSV
}

const typeMeta: Record<ColumnType, { icon: React.ComponentType<{ className?: string }>; label: string; className: string }> = {
  NUMBER: { icon: Hash, label: "NUMBER", className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  STRING: { icon: Type, label: "STRING", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  DATE: { icon: CalendarDays, label: "DATE", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
}

export function SchemaTable({ parsed }: SchemaTableProps) {
  return (
    <StepSection heading="2 · Detected Dataset Structure" description="The columns detected in your file and their types.">
      <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-left">
              <th className="px-4 py-2.5 font-medium text-muted-foreground">Column</th>
              <th className="px-4 py-2.5 font-medium text-muted-foreground">Type</th>
            </tr>
          </thead>
          <tbody>
            {parsed.columns.map((column) => {
              const meta = typeMeta[column.type]
              return (
                <tr key={column.name} className="border-t first:border-t-0">
                  <td className="px-4 py-2.5">
                    <code className="font-mono text-[13px] font-medium text-foreground">{column.name}</code>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        meta.className
                      )}
                    >
                      <meta.icon className="size-3" />
                      {meta.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
        {parsed.columns.length} column{parsed.columns.length === 1 ? "" : "s"} · {formatNumber(parsed.rowCount)} row
        {parsed.rowCount === 1 ? "" : "s"}
      </div>
      </div>
    </StepSection>
  )
}