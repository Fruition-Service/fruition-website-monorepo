# Inline website editor

Staff edit live page copy in place, Framer-style, without opening Sanity Studio.

**Use it:** portal sidebar → *Edit website*, or go to `editing.fruitionservices.io/<any path>`.
Google login (the portal's) is required. Outlined text is editable: click, type, Enter to save,
Esc to cancel. *Exit* in the bottom bar returns to the normal site.

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
5. `POST /api/internal/edit/field` sets the field on the **published** document (and on any open
   Studio draft of it), then `revalidatePath` on the page and the whole layout, and the overlay
   reloads.

## Limits

- Only text that comes from Sanity is editable. Copy hard-coded in components (most of the
  homepage, `src/components/home/data.ts`) has no marker and is not outlined.
- Plain text only: images, links, adding/removing/reordering blocks still happen in Studio.
- Saves go straight to the live site. Sanity's document history is the undo.
