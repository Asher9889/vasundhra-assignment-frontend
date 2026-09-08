import { PageHeader } from "@/components/common/PageHeader"
import { Logo } from "@/components/common/Logo"

const sections = [
  {
    title: "What this is",
    body: "The Vasudha Foundation Climate, Energy & Power Data Visualization Platform publishes interactive visualizations derived from climate, energy and power datasets. Every visualization here has passed a review workflow: an admin submits a dataset, the Super Admin reviews it, and only approved datasets are published.",
  },
  {
    title: "Data & methodology",
    body: "Datasets are submitted as CSV files and classified by domain (Climate, Energy, Power) and template type (Latitude/Longitude, State-wise, Time-series). This demonstration interface uses sample data only and is not connected to the Vasudha Foundation data warehouse.",
  },
  {
    title: "Access",
    body: "Published visualizations are freely accessible to the public. Dataset submission and moderation are reserved for authorised admins through the Admin Login.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="About the platform"
        description="A public window into climate, energy and power data published by the Vasudha Foundation."
      />

      <div className="mt-10 flex items-start gap-4 rounded-lg border bg-muted/20 p-6">
        <span className="hidden sm:block">
          <Logo compact />
        </span>
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">Vasudha Foundation</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Vasudha Foundation is a research organisation working on climate change, energy and resource
            governance. This platform is a demonstration of the organisation's data visualization interface.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {sections.map((s) => (
          <section key={s.title} className="rounded-lg border p-6">
            <h2 className="font-heading text-base font-semibold text-foreground">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}