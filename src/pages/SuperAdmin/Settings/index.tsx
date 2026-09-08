import { useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/common/PageHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function SuperAdminSettingsPage() {
  const [orgName, setOrgName] = useState("Vasudha Foundation")
  const [email, setEmail] = useState("data@vasudha.org")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Platform-wide configuration. These controls are disabled in this demo."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organisation profile</CardTitle>
          <CardDescription>Details shown across the public interface.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organisation name</Label>
              <Input id="org-name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-email">Contact email</Label>
              <Input id="org-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => toast.success("Settings saved (demo).")}>Save changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Approval workflow</CardTitle>
          <CardDescription>Rules applied to newly submitted datasets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Manual review required</p>
              <p className="text-xs text-muted-foreground">All datasets require Super Admin approval before publishing.</p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Notify admin on decision</p>
              <p className="text-xs text-muted-foreground">Email the submitting admin when a dataset is approved or rejected.</p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">CSV schema validation</p>
              <p className="text-xs text-muted-foreground">Validate required columns and value types on upload.</p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            Workflow toggles and notification delivery will be wired to the backend in a later phase.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}