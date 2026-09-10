import type { ReactNode } from "react"

interface StepSectionProps {
  heading: string
  description: string
  children: ReactNode
}

export function StepSection({ heading, description, children }: StepSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border bg-card p-5 sm:p-6">
      <div>
        <h2 className="font-heading text-base font-semibold tracking-tight">{heading}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}