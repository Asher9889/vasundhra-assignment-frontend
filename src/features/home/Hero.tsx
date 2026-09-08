import { Link } from "react-router-dom"
import { BarChart3, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--muted)/60,transparent)]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <BarChart3 className="size-3" />
            Verifiable open data, published by Vasudha Foundation
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Climate, Energy &amp; Power Data
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            An interactive platform presenting data-driven visualizations of climate, energy and power
            indicators across India — compiled from published datasets shown here as samples for this
            demonstration interface.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button render={<Link to="/climate" />}>
              Explore visualizations
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" render={<Link to="/about" />}>
              About the platform
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}