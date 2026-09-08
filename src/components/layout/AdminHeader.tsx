import { useState } from "react"
import { Menu, Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface AdminHeaderProps {
  title: string
  roleLabel: string
  currentUser?: { name?: string; email?: string }
  onMenuClick: () => void
  showSearch?: boolean
}

const notifications = [
  { id: "n1", title: "Dataset approved", detail: "Power Generation Trend was approved by the Super Admin." },
  { id: "n2", title: "Dataset pending review", detail: "Peak Power Demand is awaiting Super Admin approval." },
]

export function AdminHeader({ title, roleLabel, currentUser, onMenuClick, showSearch = true }: AdminHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6">
      <Button variant="ghost" size="icon-sm" className="-ml-1 lg:hidden" onClick={onMenuClick} aria-label="Open sidebar">
        <Menu />
      </Button>

      <h1 className="truncate font-heading text-base font-semibold tracking-tight sm:text-lg">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        {showSearch && (
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search…" className="w-52 pl-8" aria-label="Search" />
          </div>
        )}

        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />} aria-label="Notifications">
            <Bell className="size-4" />
            <span className="absolute top-1 right-1 flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 text-xs">
                <span className="flex items-center gap-2 text-sm font-medium">
                  {n.title}
                  <Badge variant="secondary">New</Badge>
                </span>
                <span className="text-muted-foreground">{n.detail}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setNotifOpen(false)} className="justify-center text-xs text-muted-foreground">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary font-heading text-[11px] font-semibold text-primary-foreground">
                  {(currentUser?.name ?? currentUser?.email ?? "A").charAt(0).toUpperCase()}
                </span>
              </Button>
            }
            aria-label="Account menu"
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="leading-tight">
                <p className="text-sm font-medium text-foreground">{currentUser?.name ?? "Admin"}</p>
                <p className="mt-0.5 text-xs font-normal text-muted-foreground">{roleLabel}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {currentUser?.email ?? "admin@vasudha.org"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}