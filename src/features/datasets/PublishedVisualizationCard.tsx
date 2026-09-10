import type { Dataset } from "@/constants/dataset/dataset.types"
import { VisualizationCard } from "@/components/visualization/VisualizationCard"
import { useDatasetDetailQuery } from "./hooks/useDatasetDetailQuery"

interface PublishedVisualizationCardProps {
  dataset: Dataset
  showDomain?: boolean
  detailHref?: string
  aspect?: "wide" | "standard"
}

export function PublishedVisualizationCard({
  dataset,
  showDomain,
  detailHref,
  aspect,
}: PublishedVisualizationCardProps) {
  const { dataset: detailDataset, isPending } = useDatasetDetailQuery(dataset.id)

  return (
    <VisualizationCard
      dataset={detailDataset ?? dataset}
      showDomain={showDomain}
      detailHref={detailHref}
      aspect={aspect}
      isLoading={isPending}
    />
  )
}