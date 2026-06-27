-- v12: Enforce global email uniqueness
--
-- Problem: UNIQUE INDEX idx_company_email (company_id, email, deleted_at) does NOT
-- enforce uniqueness for active users because MySQL treats NULL as distinct in
-- composite unique indexes — two rows with deleted_at = NULL and the same email
-- are allowed.
--
-- Fix:
--   1. Drop the broken composite index on users.
--   2. Add a simple UNIQUE INDEX on users.email (globally unique, ever).
--   3. Add a UNIQUE INDEX on registration_requests.admin_email for pending/active
--      requests (partial enforcement at app level; this covers the DB layer).
--
-- ⚠️  Run ONLY after deduplicating: if duplicate emails already exist in users,
--     step 2 will fail. Identify duplicates with:
--       SELECT email, COUNT(*) c FROM users WHERE deleted_at IS NULL
--       GROUP BY email HAVING c > 1;

-- 1. Drop the broken index (safe to ignore if it doesn't exist)
ALTER TABLE users
    DROP INDEX IF EXISTS idx_company_email;

-- 2. Add globally-unique email constraint on the users table
--    This will fail if duplicate active emails exist — fix the data first.
ALTER TABLE users
    ADD UNIQUE INDEX idx_email_unique (email);

-- 3. Add unique index on registration_requests per email
--    Prevents multiple pending/active requests for the same email at the DB level.
ALTER TABLE registration_requests
    ADD UNIQUE INDEX idx_reg_email_unique (admin_email);
