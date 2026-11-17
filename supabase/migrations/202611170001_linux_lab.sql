-- Linux Lab: Supabase is PostgreSQL storage; authentication belongs to the app.
-- Apply once in your project's SQL Editor, before starting the backend.
BEGIN;
CREATE SCHEMA linux_lab;
REVOKE ALL ON SCHEMA linux_lab FROM PUBLIC;

CREATE TABLE linux_lab.study_profiles (
  id uuid PRIMARY KEY,
  username text NOT NULL UNIQUE CHECK (username = lower(username) AND username ~ '^[a-z0-9][a-z0-9_.-]{2,31}$'),
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at bigint NOT NULL,
  last_seen_at bigint NOT NULL
);
CREATE INDEX study_profiles_activity ON linux_lab.study_profiles(last_seen_at, id);

CREATE TABLE linux_lab.study_sessions (
  token_hash text PRIMARY KEY CHECK (length(token_hash)=64),
  profile_id uuid NOT NULL REFERENCES linux_lab.study_profiles(id) ON DELETE CASCADE,
  created_at bigint NOT NULL,
  expires_at bigint NOT NULL
);
CREATE INDEX study_sessions_profile ON linux_lab.study_sessions(profile_id);
CREATE INDEX study_sessions_expiry ON linux_lab.study_sessions(expires_at);

CREATE TABLE linux_lab.study_progress (
  profile_id uuid PRIMARY KEY REFERENCES linux_lab.study_profiles(id) ON DELETE CASCADE,
  payload text NOT NULL CHECK (jsonb_typeof(payload::jsonb)='object'),
  revision integer NOT NULL DEFAULT 0,
  updated_at bigint NOT NULL
);
CREATE TABLE linux_lab.vm_reports (
  id uuid PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES linux_lab.study_profiles(id) ON DELETE CASCADE,
  attempt_id text NOT NULL,
  phase text NOT NULL CHECK (phase IN ('before','after')),
  payload text NOT NULL CHECK (jsonb_typeof(payload::jsonb)='object'),
  created_at bigint NOT NULL,
  UNIQUE(profile_id,attempt_id,phase)
);
CREATE TABLE linux_lab.auth_limits (
  limit_key text PRIMARY KEY,
  count integer NOT NULL,
  reset_at bigint NOT NULL
);
CREATE TABLE linux_lab.deletion_intents (
  token_hash text PRIMARY KEY,
  actor_id uuid NOT NULL REFERENCES linux_lab.study_profiles(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES linux_lab.study_profiles(id) ON DELETE CASCADE,
  target_last_seen_at bigint NOT NULL,
  expires_at bigint NOT NULL
);
CREATE TABLE linux_lab.admin_events (
  id uuid PRIMARY KEY,
  actor_id uuid REFERENCES linux_lab.study_profiles(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action='delete-profile'),
  target_id uuid NOT NULL,
  counts jsonb NOT NULL,
  created_at bigint NOT NULL
);

CREATE TABLE linux_lab.schema_migrations (version text PRIMARY KEY);
INSERT INTO linux_lab.schema_migrations(version) VALUES('202611170001_linux_lab.sql');
ALTER TABLE linux_lab.schema_migrations ENABLE ROW LEVEL SECURITY;

-- No browser/Data API access. The backend connects over TLS with DATABASE_URL.
-- RLS has no anonymous policies: all authorization occurs in the backend.
ALTER TABLE linux_lab.study_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE linux_lab.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE linux_lab.study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE linux_lab.vm_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE linux_lab.auth_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE linux_lab.deletion_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE linux_lab.admin_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA linux_lab FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN
    EXECUTE 'REVOKE ALL ON SCHEMA linux_lab FROM anon';
    EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA linux_lab FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN
    EXECUTE 'REVOKE ALL ON SCHEMA linux_lab FROM authenticated';
    EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA linux_lab FROM authenticated';
  END IF;
END $$;
COMMIT;
