import { useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/common/PageHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDateTime, initials } from "@/lib/format"

export default function AdminProfilePage() {
  const [name, setName] = useState("Vasudha Admin")
  const [email, setEmail] = useState("admin@vasudha.org")

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your administrator account details." />

      <Card>
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary text-primary-foreground">{initials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <CardDescription>{email}</CardDescription>
            <div className="mt-2 flex gap-2">
              <Badge variant="secondary">ADMIN</Badge>
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400">
                Active
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Display name</Label>
              <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => toast.success("Profile updated (demo).")}>Save changes</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Last login: {formatDateTime("2026-09-09T01:30:00Z")}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}