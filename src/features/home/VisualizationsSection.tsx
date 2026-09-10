import { Fragment } from "react"
import { VisualizationCard } from "@/components/visualization/VisualizationCard"

interface VisualizationsSectionProps {
  title: string
  description?: string
  datasets: Array<{ dataset: React.ComponentProps<typeof VisualizationCard>["dataset"]; detailHref?: string }>
  renderCard?: (
    dataset: React.ComponentProps<typeof VisualizationCard>["dataset"],
    props: { detailHref?: string }
  ) => React.ReactNode
}

export function VisualizationsSection({ title, description, datasets, renderCard }: VisualizationsSectionProps) {
  if (datasets.length === 0) return null

  return (
    <section aria-label={title}>
      <div className="mb-6">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {datasets.map(({ dataset, detailHref }) => (
          <Fragment key={dataset.id}>
            {renderCard ? (
              renderCard(dataset, { detailHref })
            ) : (
              <VisualizationCard dataset={dataset} detailHref={detailHref} />
            )}
          </Fragment>
        ))}
      </div>
    </section>
  )
}