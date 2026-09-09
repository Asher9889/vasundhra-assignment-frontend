import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/common/Logo"
import { LoginForm } from "@/features/login/LoginForm"

export default function LoginPage() {
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
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Access the Vasudha Foundation data console.
            </p>
          </div>
          <LoginForm />
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