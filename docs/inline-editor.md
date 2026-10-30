# Inline website editor

Staff edit live page copy in place, Framer-style, without opening Sanity Studio.

**Use it:** portal sidebar → *Edit website*, or go to `editing.fruitionservices.io/<any path>`.
Google login (the portal's) is required. Outlined text is editable: click, type, Enter to save,
Esc to cancel. Outlined images: click, choose a file, pick where to replace it, Replace image. *Exit* in the bottom bar returns to the normal site.

## How it works

1. `/api/internal/edit/enable` checks the portal session, turns on Next **draft mode** and sets a
   readable `fruition_edit=1` cookie. `/api/internal/edit/disable` undoes both.
2. In draft mode, `src/sanity/client.ts` reads with the edit client: uncached, and with **stega**
   on. Every Sanity string then carries its document id and field path as invisible characters.
   `stegaFilter` in `src/sanity/editMode.ts` limits this to human copy so machine values
   (`variant`, slugs, URLs) keep working.
3. `EditModeLoader` (root layout) loads `EditOverlay` only when the flag cookie is set. It never
   calls `draftMode()`/`cookies()` in the layout, so every page stays static for visitors.
4. The overlay decodes the markers, outlines those elements and on click fetches the stored value
   (`GET /api/internal/edit/field`). If the element shows exactly that value it is edited in place;
   if the template reshapes it (markdown, icons inside a link), a docked panel edits the stored copy.
5. Images: a Sanity CDN URL names its asset, so the overlay outlines every `<img>` served from
   `cdn.sanity.io` (directly or via `/_next/image`). Clicking one calls
   `GET /api/internal/edit/image`, which lists the published documents using that asset and flags
   those whose text is on the page. `POST` uploads the new file, repoints every matching image field
   in the chosen documents (paths worked out server side; crop and hotspot cleared, alt kept) and
   flushes the cache like a text save.
6. `POST /api/internal/edit/field` sets the field on the **published** document (and on any open
   Studio draft of it), then `revalidatePath` on the page and the whole layout, and the overlay
   reloads.

## Limits

- Only text that comes from Sanity is editable. Copy hard-coded in components has no marker and is
  not outlined. The home page's copy was moved into 170 slots (`homePage.copy`, registry in
  `src/components/home/copy.ts`, defaults in code); after adding a slot, run
  `npx tsx scripts/seed-home-copy.ts --apply` so it exists in Sanity and becomes editable.
  Shared parts work the same way: the top banner, the audit banner and the booking band and card
  read 33 slots on `siteSettings.copy` (registry in `src/lib/siteCopy.ts`, client components read
  them with `useSiteText()` from `SiteCopyProvider`); seed with `--site --apply`. The nav and
  footer were already Sanity fields on `siteSettings`.
  The pricing page (`/implementation-packages`) reads the `implementationPackagesPage` singleton
  laid over the defaults in its `content.ts` (`contentMerge.ts`), including the meta title and
  description; seed new fields with `npx tsx scripts/seed-implementation-packages.ts --apply`.
- Text and images only: links, alt text, adding/removing/reordering blocks still happen in Studio.
- An image shared by several documents (e.g. one logo on many logo walls) is listed per document;
  untick the ones that should keep the old image. Old assets are not deleted.
- CSS background images and images in code (`public/`) are not editable.
- Saves go straight to the live site. Sanity's document history is the undo.
