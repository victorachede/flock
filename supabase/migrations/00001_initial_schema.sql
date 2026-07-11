-- ============================================================
-- Flock — Denomination Management Platform
-- Initial Schema
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy name search

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE unit_level AS ENUM (
  'branch',        -- Local congregation (data entry)
  'church',        -- Cluster of branches (admin)
  'group',         -- Cluster of churches (coordinator)
  'state',         -- State level (overseer)
  'national'       -- HQ (read-only aggregate)
);

CREATE TYPE user_role AS ENUM (
  'secretary',     -- Branch secretary — data entry
  'admin',         -- Church admin — aggregates branches
  'coordinator',   -- Group coordinator — aggregates churches
  'overseer',      -- State overseer — aggregates groups
  'hq',            -- National HQ — read-only analytics
  'super_admin'    -- Platform admin (Flock team)
);

CREATE TYPE service_type AS ENUM (
  'monday_fellowship',
  'thursday_bible_study',
  'sunday_service',
  'special_service',  -- crusades, conventions, etc.
  'youth_service',
  'womens_fellowship',
  'mens_fellowship'
);

CREATE TYPE submission_status AS ENUM (
  'draft',
  'submitted',
  'acknowledged',
  'queried'       -- overseer or admin has a question about the data
);

CREATE TYPE report_status AS ENUM (
  'pending',
  'compiled',
  'forwarded',
  'received',
  'acknowledged'
);

-- ============================================================
-- DENOMINATIONS
-- Supports multi-denomination from day one (configurable hierarchy)
-- ============================================================

CREATE TABLE denominations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  abbreviation    TEXT,                    -- e.g. "DLBC", "RCCG"
  logo_url        TEXT,
  primary_color   TEXT DEFAULT '#1E3D82',  -- brand customization
  accent_color    TEXT DEFAULT '#F59E0B',
  
  -- Hierarchy config: what to call each level in this denomination
  level_names     JSONB NOT NULL DEFAULT '{
    "branch": "Branch",
    "church": "Church",
    "group": "Group",
    "state": "State",
    "national": "National"
  }'::jsonb,
  
  -- Which service types this denomination uses
  active_service_types  service_type[] DEFAULT ARRAY[
    'monday_fellowship', 'thursday_bible_study', 'sunday_service'
  ]::service_type[],
  
  -- Whether to track offerings (some denominations prefer not to)
  track_offerings BOOLEAN DEFAULT TRUE,
  
  -- Whether to track qualitative notes (testimonies etc.)
  track_testimonies BOOLEAN DEFAULT TRUE,
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UNITS (the hierarchy tree)
-- ============================================================

CREATE TABLE units (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  denomination_id UUID NOT NULL REFERENCES denominations(id) ON DELETE CASCADE,
  parent_id       UUID REFERENCES units(id) ON DELETE RESTRICT,
  
  name            TEXT NOT NULL,
  level           unit_level NOT NULL,
  code            TEXT,                    -- e.g. "BEN-GRP-04" — human-readable ref
  
  -- Location
  address         TEXT,
  city            TEXT,
  state_province  TEXT,
  country         TEXT DEFAULT 'Nigeria',
  latitude        DECIMAL(9, 6),
  longitude       DECIMAL(9, 6),
  
  -- Contact
  contact_name    TEXT,
  contact_phone   TEXT,
  contact_email   TEXT,
  
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_hierarchy CHECK (
    -- Branches must have a parent (church), national has no parent
    (level = 'national' AND parent_id IS NULL) OR
    (level != 'national' AND parent_id IS NOT NULL)
  )
);

-- Index for fast hierarchy traversal
CREATE INDEX idx_units_parent ON units(parent_id);
CREATE INDEX idx_units_denomination ON units(denomination_id);
CREATE INDEX idx_units_level ON units(level);

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  denomination_id UUID NOT NULL REFERENCES denominations(id),
  unit_id         UUID NOT NULL REFERENCES units(id),
  
  role            user_role NOT NULL,
  full_name       TEXT NOT NULL,
  phone           TEXT,
  
  -- Onboarding
  onboarding_complete BOOLEAN DEFAULT FALSE,
  
  -- Soft delete
  is_active       BOOLEAN DEFAULT TRUE,
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_unit ON user_profiles(unit_id);
CREATE INDEX idx_profiles_denomination ON user_profiles(denomination_id);

-- ============================================================
-- ATTENDANCE RECORDS
-- Core data entry table — filled by branch secretaries
-- ============================================================

CREATE TABLE attendance_records (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id         UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  
  service_date    DATE NOT NULL,
  service_type    service_type NOT NULL,
  
  -- Attendance breakdown (DLBC tracks these separately)
  men_count       INTEGER NOT NULL DEFAULT 0 CHECK (men_count >= 0),
  women_count     INTEGER NOT NULL DEFAULT 0 CHECK (women_count >= 0),
  children_count  INTEGER NOT NULL DEFAULT 0 CHECK (children_count >= 0),
  
  -- Derived (stored for query performance)
  total_attendance INTEGER GENERATED ALWAYS AS (men_count + women_count + children_count) STORED,
  
  -- New arrivals
  first_timers    INTEGER DEFAULT 0 CHECK (first_timers >= 0),
  new_converts    INTEGER DEFAULT 0 CHECK (new_converts >= 0),
  
  -- Financials (optional based on denomination config)
  offering_amount DECIMAL(12, 2),
  tithe_amount    DECIMAL(12, 2),
  
  -- Qualitative
  testimony_notes TEXT,    -- Notable testimonies from the service
  prayer_requests TEXT,    -- Prayer items to escalate
  admin_notes     TEXT,    -- Internal notes for the record
  
  -- Submission tracking
  status          submission_status DEFAULT 'draft',
  submitted_by    UUID REFERENCES auth.users(id),
  submitted_at    TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  
  -- Offline support: track if record was created offline and synced later
  created_offline BOOLEAN DEFAULT FALSE,
  offline_id      TEXT,    -- Client-generated UUID for deduplication
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(unit_id, service_date, service_type)
);

CREATE INDEX idx_attendance_unit ON attendance_records(unit_id);
CREATE INDEX idx_attendance_date ON attendance_records(service_date);
CREATE INDEX idx_attendance_status ON attendance_records(status);

-- ============================================================
-- REPORT PERIODS
-- Monthly aggregation snapshots — frozen when forwarded
-- ============================================================

CREATE TABLE report_periods (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id         UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  
  month           INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year            INTEGER NOT NULL CHECK (year >= 2020),
  
  status          report_status DEFAULT 'pending',
  
  -- Frozen snapshot of aggregated data at time of forwarding
  -- Stored as JSONB so it's flexible across denomination structures
  compiled_data   JSONB,
  
  compiled_by     UUID REFERENCES auth.users(id),
  compiled_at     TIMESTAMPTZ,
  forwarded_by    UUID REFERENCES auth.users(id),
  forwarded_at    TIMESTAMPTZ,
  received_by     UUID REFERENCES auth.users(id),
  received_at     TIMESTAMPTZ,
  
  -- Optional notes at each stage
  compiler_notes  TEXT,
  receiver_notes  TEXT,
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(unit_id, month, year)
);

CREATE INDEX idx_reports_unit ON report_periods(unit_id);
CREATE INDEX idx_reports_period ON report_periods(year, month);

-- ============================================================
-- ANNOUNCEMENTS
-- Top-down communication (HQ or Overseer to all units below)
-- ============================================================

CREATE TABLE announcements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  denomination_id UUID NOT NULL REFERENCES denominations(id),
  
  -- Scoped to a unit and all units below it
  -- NULL = denomination-wide
  target_unit_id  UUID REFERENCES units(id),
  target_level    unit_level,  -- NULL = all levels
  
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  is_urgent       BOOLEAN DEFAULT FALSE,
  
  created_by      UUID REFERENCES auth.users(id),
  published_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- OFFLINE SYNC QUEUE (server-side record of synced offline items)
-- ============================================================

CREATE TABLE sync_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id),
  offline_id      TEXT NOT NULL,
  entity_type     TEXT NOT NULL,  -- 'attendance_record'
  entity_id       UUID,
  synced_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(offline_id, entity_type)
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_units_updated_at
  BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_attendance_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_reports_updated_at
  BEFORE UPDATE ON report_periods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- FUNCTION: get all descendant unit IDs (recursive)
-- Usage: SELECT * FROM get_descendant_unit_ids('some-uuid')
-- Used by coordinator/overseer dashboards to query down the tree
-- ============================================================

CREATE OR REPLACE FUNCTION get_descendant_unit_ids(root_unit_id UUID)
RETURNS TABLE(unit_id UUID, depth INTEGER) AS $$
WITH RECURSIVE descendants AS (
  SELECT id AS unit_id, 0 AS depth
  FROM units WHERE id = root_unit_id
  
  UNION ALL
  
  SELECT u.id, d.depth + 1
  FROM units u
  JOIN descendants d ON u.parent_id = d.unit_id
)
SELECT unit_id, depth FROM descendants;
$$ LANGUAGE sql STABLE;

-- ============================================================
-- FUNCTION: aggregate attendance for a unit and period
-- Aggregates all branches beneath a given unit for a month
-- ============================================================

CREATE OR REPLACE FUNCTION aggregate_unit_attendance(
  p_unit_id UUID,
  p_month INTEGER,
  p_year INTEGER
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'unit_id', p_unit_id,
    'month', p_month,
    'year', p_year,
    'total_men', COALESCE(SUM(ar.men_count), 0),
    'total_women', COALESCE(SUM(ar.women_count), 0),
    'total_children', COALESCE(SUM(ar.children_count), 0),
    'total_attendance', COALESCE(SUM(ar.total_attendance), 0),
    'total_first_timers', COALESCE(SUM(ar.first_timers), 0),
    'total_new_converts', COALESCE(SUM(ar.new_converts), 0),
    'total_offering', COALESCE(SUM(ar.offering_amount), 0),
    'service_count', COUNT(*),
    'branch_count', COUNT(DISTINCT ar.unit_id),
    'generated_at', NOW()
  )
  INTO result
  FROM attendance_records ar
  JOIN get_descendant_unit_ids(p_unit_id) d ON ar.unit_id = d.unit_id
  WHERE 
    EXTRACT(MONTH FROM ar.service_date) = p_month AND
    EXTRACT(YEAR FROM ar.service_date) = p_year AND
    ar.status IN ('submitted', 'acknowledged');
    
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE denominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Users can see their own denomination
CREATE POLICY "users_see_own_denomination" ON denominations
  FOR SELECT USING (
    id IN (
      SELECT denomination_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Users can see units in their denomination
CREATE POLICY "users_see_denomination_units" ON units
  FOR SELECT USING (
    denomination_id IN (
      SELECT denomination_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Secretaries can only see/edit their own branch's attendance
-- Admins/coordinators/overseers can see descendant units' attendance
CREATE POLICY "attendance_select_policy" ON attendance_records
  FOR SELECT USING (
    unit_id IN (
      SELECT d.unit_id FROM get_descendant_unit_ids(
        (SELECT unit_id FROM user_profiles WHERE id = auth.uid())
      ) d
    )
  );

CREATE POLICY "attendance_insert_policy" ON attendance_records
  FOR INSERT WITH CHECK (
    -- Only secretaries can insert, only for their own branch
    unit_id = (SELECT unit_id FROM user_profiles WHERE id = auth.uid()) AND
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'secretary'
  );

CREATE POLICY "attendance_update_policy" ON attendance_records
  FOR UPDATE USING (
    -- Secretaries can update draft records for their branch
    (unit_id = (SELECT unit_id FROM user_profiles WHERE id = auth.uid()) AND
     status = 'draft' AND
     (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'secretary')
    OR
    -- Admins and above can update status (acknowledge, query)
    ((SELECT role FROM user_profiles WHERE id = auth.uid()) IN ('admin', 'coordinator', 'overseer', 'hq', 'super_admin'))
  );

-- Users can read their own profile
CREATE POLICY "users_read_own_profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "users_update_own_profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

-- Report periods: same hierarchy read rules
CREATE POLICY "reports_select_policy" ON report_periods
  FOR SELECT USING (
    unit_id IN (
      SELECT d.unit_id FROM get_descendant_unit_ids(
        (SELECT unit_id FROM user_profiles WHERE id = auth.uid())
      ) d
    )
  );

-- Announcements: users see announcements for their unit's level or denomination-wide
CREATE POLICY "announcements_select_policy" ON announcements
  FOR SELECT USING (
    denomination_id IN (
      SELECT denomination_id FROM user_profiles WHERE id = auth.uid()
    ) AND (
      target_unit_id IS NULL OR
      target_unit_id IN (
        SELECT d.unit_id FROM get_descendant_unit_ids(
          (SELECT unit_id FROM user_profiles WHERE id = auth.uid())
        ) d
      )
    )
  );

-- ============================================================
-- SEED: DLBC as first denomination
-- ============================================================

INSERT INTO denominations (id, name, abbreviation, primary_color, accent_color, level_names)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Deeper Life Bible Church',
  'DLBC',
  '#1E3D82',
  '#F59E0B',
  '{
    "branch": "Branch",
    "church": "Church",
    "group": "Group",
    "state": "State",
    "national": "National"
  }'::jsonb
);
