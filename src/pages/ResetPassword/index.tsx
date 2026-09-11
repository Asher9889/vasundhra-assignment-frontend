import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  ArrowLeft,
  Loader2,
  Lock,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react"
import { Logo } from "@/components/common/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/config"
import { useResetPassword } from "./hooks/useResetPassword"
import { INVALID_TOKEN_STATUS } from "./types/resetPassword.types"

function isInvalidTokenError(error: Error | null): boolean {
  return error instanceof ApiError && error.statusCode === INVALID_TOKEN_STATUS
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const missingToken = token.length === 0

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    isPending,
    isError,
    isSuccess,
    error,
    reset,
  } = useResetPassword(token)

  const invalidLink = isError && isInvalidTokenError(error)
  const showInvalidLink = missingToken || invalidLink

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
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {showInvalidLink ? "Invalid reset link" : "Reset password"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {showInvalidLink
                ? "The password reset link you followed is invalid or has expired."
                : "Choose a new password for your account."}
            </p>
          </div>

          {isSuccess ? (
            <div className="space-y-4">
              <div className="flex gap-2 rounded-md border bg-[var(--muted)]/40 p-4 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-foreground">Password reset successfully.</p>
              </div>
              <p className="text-sm text-muted-foreground">You can now sign in with your new password.</p>
              <Button className="w-full" render={<Link to="/login" />}>
                Back to login
              </Button>
            </div>
          ) : showInvalidLink ? (
            <div className="space-y-4">
              <div className="flex gap-2 rounded-md border bg-[var(--muted)]/40 p-4 text-sm">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <p className="text-foreground">
                  This password reset link is invalid or expired. Please request a new one.
                </p>
              </div>
              <Button className="w-full" render={<Link to="/forgot-password" />}>
                <RefreshCw className="size-4" />
                Request a new reset link
              </Button>
              <Button variant="outline" className="w-full" render={<Link to="/login" />}>
                Back to login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    className="pr-10"
                    {...register("password", {
                      onChange: () => {
                        if (isError) reset()
                      },
                    })}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    disabled={isPending}
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
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your new password"
                    className="pr-10"
                    {...register("confirmPassword", {
                      onChange: () => {
                        if (isError) reset()
                      },
                    })}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                    disabled={isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="size-3" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {isError && !invalidLink && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="size-3" />
                  {error?.message || "Something went wrong. Please try again."}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
                {isPending ? "Resetting password..." : "Reset password"}
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