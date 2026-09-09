import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ShieldAlert } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import type { UserRole } from "@/types/route.type"

interface RoleGuardProps {
  roles: UserRole[]
  children: ReactNode
}

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user || !roles.includes(user.role)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <ShieldAlert className="size-7 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">Access denied</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            You don't have permission to view this page.
          </p>
        </div>
        <Button variant="outline" size="sm" render={<Link to="/" />}>
          Go to dashboard
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
