import { useState } from "react"
import { NavLink, Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/common/Logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { USER_ROLE } from "@/constants/user/user.constant"
import { AUTH_STATUS } from "@/constants/auth/auth.constants"
import type { TUserRole } from "@/constants/user/user.types"

const navItems = [
  { label: "Climate", to: "/climate" },
  { label: "Energy", to: "/energy" },
  { label: "Power", to: "/power" },
  { label: "About", to: "/about" },
]

const HOME_PATH: Record<TUserRole, string> = {
  [USER_ROLE.SUPER_ADMIN]: "/super-admin",
  [USER_ROLE.ADMIN]: "/admin",
}

export function PublicHeader() {
  const [open, setOpen] = useState(false)
  const { user, status } = useAuth()

  const checking = status === AUTH_STATUS.CHECKING

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Vasudha Foundation data platform home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          {user ? (
            <Button variant="outline" className="text-sm" render={<Link to={HOME_PATH[user.role] ?? "/"} />}>
              {user.email}
            </Button>
          ) : (
            <Button variant="outline" className="text-sm" render={<Link to="/login" />}>
              {checking ? "…" : "Login"}
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <div className="border-t px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium",
                    isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 border-t pt-3">
              {user ? (
                <Button
                  variant="outline"
                  className="w-full"
                  render={<Link to={HOME_PATH[user.role] ?? "/"} onClick={() => setOpen(false)} />}
                >
                  {user.email}
                </Button>
              ) : (
                <Button variant="outline" className="w-full" render={<Link to="/login" onClick={() => setOpen(false)} />}>
                  {checking ? "…" : "Login"}
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}