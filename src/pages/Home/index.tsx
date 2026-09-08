import { Hero } from "@/features/home/Hero"
import { VisualizationsSection } from "@/features/home/VisualizationsSection"
import { WorkflowSection } from "@/features/home/WorkflowSection"
import { useMockDatasets } from "@/lib/dataset-store"

export default function HomePage() {
  const datasets = useMockDatasets()
    .filter((d) => d.status === "approved")
    .map((dataset) => ({ dataset }))

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <VisualizationsSection
          title="Published visualizations"
          description="Approved climate, energy and power datasets, presented as interactive visualizations in publication order."
          datasets={datasets}
        />
      </div>
      <WorkflowSection />
    </>
  )
}