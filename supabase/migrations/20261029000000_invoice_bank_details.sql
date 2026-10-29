-- Bank account payment details on invoices.
--
-- Fruition is moving consultants off Wise email addresses / Wisetags and onto
-- bank transfers, so an invoice can now say "pay this bank account" instead.
-- `payment_method` picks which block the invoice prints; rows saved before this
-- have it NULL and keep rendering their Wise details exactly as before.
--
-- Additive only, safe to re-run.

ALTER TABLE fruition_invoices
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS bank_account_name TEXT,
  ADD COLUMN IF NOT EXISTS bank_name TEXT,
  ADD COLUMN IF NOT EXISTS bank_address TEXT,
  ADD COLUMN IF NOT EXISTS bank_code TEXT,
  ADD COLUMN IF NOT EXISTS bank_account_number TEXT,
  ADD COLUMN IF NOT EXISTS bank_swift TEXT;
