import { Leaf, Loader2 } from "lucide-react"

export function SplashScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Leaf className="size-6" />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading...
      </div>
    </div>
  )
}
