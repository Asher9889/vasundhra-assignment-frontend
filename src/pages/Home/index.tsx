import { APPROVAL_STATUS } from "@/constants/dataset/dataset.constants"
import { Hero } from "@/features/home/Hero"
import { VisualizationsSection } from "@/features/home/VisualizationsSection"
import { WorkflowSection } from "@/features/home/WorkflowSection"
import { PublishedVisualizationCard } from "@/features/datasets/PublishedVisualizationCard"
import { useDatasetsQuery } from "@/features/datasets/hooks/useDatasetsQuery"

export default function HomePage() {
  const { datasets } = useDatasetsQuery({ status: APPROVAL_STATUS.APPROVED })

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <VisualizationsSection
          title="Published visualizations"
          description="Approved climate, energy and power datasets, presented as interactive visualizations in publication order."
          datasets={datasets.map((dataset) => ({ dataset }))}
          renderCard={(dataset, props) => <PublishedVisualizationCard dataset={dataset} {...props} />}
        />
      </div>
      <WorkflowSection />
    </>
  )
}