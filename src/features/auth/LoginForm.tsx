import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import type { DemoAccount, LoginErrors, LoginFormValues, LoginStatus } from "@/types/auth"

const demoAccounts: DemoAccount[] = [
  {
    id: "sa",
    label: "Super Admin",
    description: "Review and manage everything",
    email: "superadmin@vasudha.org",
    password: "superadmin",
    redirectTo: "/admin",
    role: "SUPER_ADMIN",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Submit and manage datasets",
    email: "admin@vasudha.org",
    password: "admin123",
    redirectTo: "/admin/dashboard",
    role: "ADMIN",
  },
]

function validate(values: LoginFormValues): LoginErrors {
  const errors: LoginErrors = {}
  if (!values.email.trim()) {
    errors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address"
  }
  if (!values.password) {
    errors.password = "Password is required"
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters"
  }
  return errors
}

export function LoginForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState<LoginFormValues>({ email: "", password: "" })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [status, setStatus] = useState<LoginStatus>("idle")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)

  useEffect(() => {
    if (status !== "idle") return
    setErrors(validate(values))
  }, [values, status])

  function fillDemo(account: DemoAccount) {
    setValues({ email: account.email, password: account.password })
    setErrors({})
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const foundErrors = validate(values)
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length > 0) {
      setStatus("error")
      return
    }

    setStatus("submitting")
    window.setTimeout(() => {
      const matchesDemo = demoAccounts.find((a) => a.email === values.email.toLowerCase())
      if (matchesDemo) {
        setStatus("success")
        toast.success(`Signed in as ${matchesDemo.label}`)
        window.setTimeout(() => navigate(matchesDemo.redirectTo), 400)
      } else {
        setStatus("idle")
        toast.error("Invalid credentials. Use a demo account below.")
      }
    }, 900)
  }

  const submitting = status === "submitting"

  return (
    <div className="w-full max-w-md">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@organisation.org"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={submitting}
          />
          {errors.email && (
            <p id="email-error" className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="size-3" />
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
              onClick={() => {
                toast.info("Password reset is disabled in this demo.")
              }}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={submitting}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
          {errors.password && (
            <p id="password-error" className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="size-3" />
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" checked={remember} onCheckedChange={(c) => setRemember(Boolean(c))} />
          <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
            Keep me signed in
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          {submitting ? "Signing in…" : "Login"}
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">
              Demo accounts
            </span>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          {demoAccounts.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => fillDemo(account)}
              className="flex items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted/40"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{account.label}</p>
                <p className="text-xs text-muted-foreground">{account.description}</p>
              </div>
              <code className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                {account.email}
              </code>
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Authentication is mocked for this demo. Pick an account to explore the corresponding console.
        </p>
      </div>
    </div>
  )
}