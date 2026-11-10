/**
 * Local preview of the Version C menu and footer without writing to Sanity.
 *
 *   npx tsx scripts/seed-nav-vc.ts --preview-file /tmp/nav-vc.json
 *   NAV_VC_PREVIEW_FILE=/tmp/nav-vc.json npm run dev
 *
 * The file is the exact patch `--apply` would write to siteSettings (it
 * uploads the icon assets, which changes no document). Never
 * active in a production build, whatever the environment says.
 */
export async function applyNavPreview(settings: Record<string, unknown> | null | undefined): Promise<void> {
  const file = process.env.NAV_VC_PREVIEW_FILE
  if (!file || !settings || process.env.NODE_ENV === 'production') return
  const { readFile } = await import('node:fs/promises')
  Object.assign(settings, JSON.parse(await readFile(file, 'utf8')))
}
