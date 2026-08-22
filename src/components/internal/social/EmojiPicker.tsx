"use client"

import { useMemo, useState } from "react"
import { Smile } from "lucide-react"
import { EMOJI_GROUPS, glyphOf, searchEmoji } from "@/lib/social/emoji"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

/**
 * Emoji for a caption, picked rather than pasted in from a web search.
 *
 * Stays open after a pick, because captions rarely want exactly one emoji and
 * reopening the panel for the second is the annoying part. The caller decides
 * where the character lands — this component only ever hands back a glyph.
 */
export default function EmojiPicker({
  onPick,
  onClose,
  disabled = false,
  label = "Emoji",
}: {
  onPick: (emoji: string) => void
  /** Hand the cursor back to the caption once the panel is done. */
  onClose?: () => void
  disabled?: boolean
  /** Accessible name; the button itself is icon-only in tight rows. */
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const groups = useMemo(() => searchEmoji(query), [query])

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setQuery("")
          onClose?.()
        }
      }}
    >
      <PopoverTrigger
        render={
          <Button variant="ghost" size="xs" disabled={disabled} nativeButton title={label} aria-label={label}>
            <Smile />
          </Button>
        }
      />
      <PopoverContent align="end" className="w-[19rem] gap-2 p-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search emoji"
          aria-label="Search emoji"
          autoFocus
          className="h-8 w-full rounded-md border border-border bg-background px-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
        />

        <div className="max-h-64 overflow-y-auto pr-0.5">
          {groups.length === 0 && (
            <p className="px-1 py-6 text-center text-xs text-muted-foreground">
              Nothing matches “{query}”.
            </p>
          )}
          {groups.map((group) => (
            <div key={group.name} className="mb-1">
              <p className="sticky top-0 bg-popover py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {group.name}
              </p>
              <div className="grid grid-cols-8 gap-0.5">
                {group.entries.map((entry) => {
                  const glyph = glyphOf(entry)
                  return (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => onPick(glyph)}
                      title={entry.slice(glyph.length).trim()}
                      className="flex h-8 items-center justify-center rounded-md text-lg leading-none transition hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                    >
                      {glyph}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="border-t border-border pt-1.5 text-[11px] text-muted-foreground">
          {EMOJI_GROUPS.reduce((n, g) => n + g.entries.length, 0)} emoji · lands at your cursor · stays open for more
        </p>
      </PopoverContent>
    </Popover>
  )
}
