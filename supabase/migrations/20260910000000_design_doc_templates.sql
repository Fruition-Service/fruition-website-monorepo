-- Design documents gain a template.
--
-- Before this, the Design function had exactly one hard-coded output format (a
-- sign-off document) and the model authored its own CSS on every generation.
-- Documents now pick a template, and the stylesheet is injected at render time
-- from src/lib/design/theme instead of living in the saved HTML.
--
-- Existing rows default to 'legacy': they carry their own model-authored CSS,
-- so they keep rendering with only the original defensive print fixes rather
-- than having a stylesheet layered over CSS we didn't write. No backfill.

alter table public.design_docs
  add column if not exists template text not null default 'legacy';

comment on column public.design_docs.template is
  'Template id from src/lib/design/templates (signoff|proposal|report|slides|rebrand), or ''legacy'' for documents generated before templates existed.';
