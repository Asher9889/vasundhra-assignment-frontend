import { Link } from "react-router-dom"
import { ArrowLeft, Loader2, Mail, AlertCircle, CheckCircle2 } from "lucide-react"
import { Logo } from "@/components/common/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForgotPassword } from "./hooks/useForgotPassword"

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    isPending,
    isError,
    isSuccess,
    error,
    reset,
  } = useForgotPassword()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center border-b px-4 sm:px-6">
        <Link to="/" aria-label="Back to public site">
          <Logo />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Forgot password</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your account email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {isSuccess ? (
            <div className="space-y-4">
              <div className="flex gap-2 rounded-md border bg-[var(--muted)]/40 p-4 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-foreground">
                  If an account exists for this email, a password reset link has been sent.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                The link expires in 10 minutes and can only be used once.
              </p>
              <Button variant="outline" className="w-full" render={<Link to="/login" />}>
                Back to login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@organisation.org"
                  {...register("email", {
                    onChange: () => {
                      if (isError) reset()
                    },
                  })}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  disabled={isPending}
                />
                {errors.email && (
                  <p id="email-error" className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="size-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {isError && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="size-3" />
                  {error?.message || "Something went wrong. Please try again."}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
                {isPending ? "Sending reset link..." : "Send reset link"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Remembered your password?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>

      <footer className="border-t px-6 py-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to public website
        </Link>
      </footer>
    </div>
  )
}