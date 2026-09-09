import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { USER_ROLE } from "@/constants/user/user.constant"
import { useAddAdmin } from "../hooks/useAddAdmin"

interface AddAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddAdminDialog({ open, onOpenChange }: AddAdminDialogProps) {
  const { register, control, formState: { errors }, handleSubmit, isPending, isSuccess, reset } = useAddAdmin()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false)
      setShowPassword(false)
      reset()
    }
  }, [isSuccess, reset, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isPending && onOpenChange(nextOpen)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add admin</DialogTitle>
          <DialogDescription>Create a new administrator or super admin account.</DialogDescription>
        </DialogHeader>
        <form id="add-admin-form" onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="naya.admin@vasudha.org"
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
              disabled={isPending}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="6–20 characters"
                {...register("password")}
                aria-invalid={Boolean(errors.password)}
                disabled={isPending}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isPending}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={USER_ROLE.ADMIN}>ADMIN</SelectItem>
                    <SelectItem value={USER_ROLE.SUPER_ADMIN}>SUPER_ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-[11px] text-muted-foreground">Only administrators can be enabled or disabled later.</p>
          </div>

          <div className="space-y-1.5">
            <Label>Account status</Label>
            <div className="pointer-events-none">
              <Badge variant="outline" className="h-8 w-full justify-center rounded-lg border-emerald-500/50 text-emerald-600 dark:text-emerald-400">
                ACTIVE
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">Accounts start active.</p>
          </div>

          <div className="rounded-lg border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
            A welcome email with sign-in credentials is sent to the address above once the account is created.
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="add-admin-form" disabled={isPending}>
            {isPending ? "Creating…" : "Create Admin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}