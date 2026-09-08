import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { VisualizationCard } from "@/components/visualization/VisualizationCard"
import { useMockDatasets } from "@/lib/dataset-store"
import type { Domain } from "@/types"
import { domainLabels } from "@/lib/format"

interface DomainPageContentProps {
  domain: Domain
  description: string
}

export function DomainPageContent({ domain, description }: DomainPageContentProps) {
  const datasets = useMockDatasets().filter((d) => d.domain === domain && d.status === "approved")

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title={`${domainLabels[domain]} Visualizations`} description={description} />

      <div className="mt-10">
        {datasets.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {datasets.map((dataset) => (
              <VisualizationCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <EmptyState
              title={`No ${domainLabels[domain]} visualizations yet`}
              description="Approved visualizations for this domain will appear here."
            />
          </div>
        )}
      </div>
    </div>
  )
}