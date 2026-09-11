import { Link } from "react-router-dom"
import { Logo } from "@/components/common/Logo"

const footerLinks = [
  {
    heading: "Visualizations",
    links: [
      { label: "Climate", to: "/climate" },
      { label: "Energy", to: "/energy" },
      { label: "Power", to: "/power" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Overview", to: "/about" },
      { label: "Methodology", to: "/about" },
    ],
  },
]

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              A public platform publishing evidence-based climate, energy and power data
              visualizations compiled from verified datasets.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h3 className="font-heading text-sm font-medium text-foreground">{group.heading}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Vasudha Foundation. All rights reserved.
          </p>
          {/* <p className="mt-1 text-xs text-muted-foreground">
            This is a demonstration interface. Data shown is sample data for UI evaluation.
          </p> */}
        </div>
      </div>
    </footer>
  )
}