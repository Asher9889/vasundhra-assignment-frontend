import { Link } from "react-router-dom"
import { FilePlus2, FileSearch, CheckCircle2, Globe } from "lucide-react"

const steps = [
  {
    icon: FilePlus2,
    title: "Admin submits dataset",
    description: "Dataset submitted by a registered admin for review.",
  },
  {
    icon: FileSearch,
    title: "Super Admin reviews",
    description: "The dataset is validated before it can be published.",
  },
  {
    icon: CheckCircle2,
    title: "Approve or reject",
    description: "Approved datasets are published; rejected ones stay hidden.",
  },
  {
    icon: Globe,
    title: "Published publicly",
    description: "Approved visualizations appear on the public website.",
  },
]

export function WorkflowSection() {
  return (
    <section aria-label="How publishing works" className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">How visualizations are published</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every visualization on this site has passed a review workflow before appearing here.
        </p>

        <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3 bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <step.icon className="size-4" />
                </span>
                <span className="font-heading text-sm font-semibold text-muted-foreground">0{i + 1}</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-sm text-muted-foreground">
          Use the{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Admin Login
          </Link>{" "}
          to explore the review and publishing workflow.
        </p>
      </div>
    </section>
  )
}