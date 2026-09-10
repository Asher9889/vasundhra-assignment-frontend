import type { ParsedCSV } from "../types/add-dataset.types"
import { StepSection } from "./StepSection"

interface DataPreviewTableProps {
  parsed: ParsedCSV
  maxRows?: number
}

const DEFAULT_MAX_ROWS = 3

export function DataPreviewTable({ parsed, maxRows = DEFAULT_MAX_ROWS }: DataPreviewTableProps) {
  const previewRows = parsed.rows.slice(0, maxRows)
  const hasMore = parsed.rowCount > maxRows

  return (
    <StepSection heading="4 · Dataset Preview" description="Verify the first few rows of your file.">
      <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-left">
              {parsed.columns.map((column) => (
                <th key={column.name} className="px-4 py-2.5 font-medium whitespace-nowrap text-muted-foreground">
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {parsed.columns.map((column, columnIndex) => (
                  <td key={column.name} className="px-4 py-2 whitespace-nowrap font-mono text-[13px] text-foreground">
                    {row[columnIndex] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="border-t bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
          Showing first {previewRows.length} of {parsed.rowCount} rows
        </div>
      )}
      </div>
    </StepSection>
  )
}