import { Link, useNavigate } from "react-router-dom"
import { ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { USER_ROLE } from "@/constants/user/user.constant"

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const dashboardPath = user?.role === USER_ROLE.SUPER_ADMIN ? "/super-admin" : "/admin"

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <ShieldOff className="size-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Access Denied</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          You don't have permission to view this page. This area requires a different role.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button render={<Link to={dashboardPath} />}>
          Go to dashboard
        </Button>
      </div>
    </div>
  )
}
