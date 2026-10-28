import { requirePortalUser } from "@/lib/portalAuth"
import PortalShell from "@/components/internal/PortalShell"
import PageHeader from "@/components/internal/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const dynamic = "force-dynamic"

/**
 * Entry point for the inline website editor. Opens any page of the public
 * site in edit mode, where outlined text can be clicked and changed in place.
 * editing.fruitionservices.io/<path> lands on the same switch.
 */
export default async function EditWebsitePage() {
  const user = await requirePortalUser({ next: "/internal/edit" })
  return (
    <PortalShell email={user.email} active="edit">
      <PageHeader
        title="Edit website"
        description="Open a page of the live site, click any outlined text, change it and save. The site updates straight away."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Open a page to edit</CardTitle>
            <CardDescription>Use the path after fruitionservices.io, for example /about-us.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* A plain GET form, not a <Link>: the target is a route handler
                that switches edit mode on, and must never be prefetched. */}
            <form action="/api/internal/edit/enable" method="get" className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="edit-path">Page</Label>
                <Input id="edit-path" name="path" defaultValue="/" className="min-h-11" />
              </div>
              <Button type="submit" className="min-h-11">
                Open in editor
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>Text that comes from Sanity gets a dashed outline. Click it to edit, press Enter to save, Esc to cancel.</p>
            <p>Saving writes straight to the published page and clears the site cache, so visitors see it on their next page load.</p>
            <p>Text with no outline is written in the site code. Ask the web team to change it.</p>
            <p>Use Exit in the bar at the bottom to go back to the normal site.</p>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  )
}
