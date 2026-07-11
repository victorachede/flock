// ============================================================
// Flock — Database Types (mirrors Supabase schema)
// ============================================================

export type UnitLevel = 'branch' | 'church' | 'group' | 'state' | 'national'
export type UserRole = 'secretary' | 'admin' | 'coordinator' | 'overseer' | 'hq' | 'super_admin'
export type ServiceType =
  | 'monday_fellowship'
  | 'thursday_bible_study'
  | 'sunday_service'
  | 'special_service'
  | 'youth_service'
  | 'womens_fellowship'
  | 'mens_fellowship'
export type SubmissionStatus = 'draft' | 'submitted' | 'acknowledged' | 'queried'
export type ReportStatus = 'pending' | 'compiled' | 'forwarded' | 'received' | 'acknowledged'

export interface Denomination {
  id: string
  name: string
  abbreviation: string | null
  logo_url: string | null
  primary_color: string
  accent_color: string
  level_names: Record<UnitLevel, string>
  active_service_types: ServiceType[]
  track_offerings: boolean
  track_testimonies: boolean
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  denomination_id: string
  parent_id: string | null
  name: string
  level: UnitLevel
  code: string | null
  address: string | null
  city: string | null
  state_province: string | null
  country: string
  latitude: number | null
  longitude: number | null
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  denomination_id: string
  unit_id: string
  role: UserRole
  full_name: string
  phone: string | null
  onboarding_complete: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined fields
  unit?: Unit
  denomination?: Denomination
}

export interface AttendanceRecord {
  id: string
  unit_id: string
  service_date: string // ISO date string
  service_type: ServiceType
  men_count: number
  women_count: number
  children_count: number
  total_attendance: number // computed
  first_timers: number
  new_converts: number
  offering_amount: number | null
  tithe_amount: number | null
  testimony_notes: string | null
  prayer_requests: string | null
  admin_notes: string | null
  status: SubmissionStatus
  submitted_by: string | null
  submitted_at: string | null
  acknowledged_by: string | null
  acknowledged_at: string | null
  created_offline: boolean
  offline_id: string | null
  created_at: string
  updated_at: string
  // Joined
  unit?: Unit
}

export interface ReportPeriod {
  id: string
  unit_id: string
  month: number
  year: number
  status: ReportStatus
  compiled_data: AggregatedAttendance | null
  compiled_by: string | null
  compiled_at: string | null
  forwarded_by: string | null
  forwarded_at: string | null
  received_by: string | null
  received_at: string | null
  compiler_notes: string | null
  receiver_notes: string | null
  created_at: string
  updated_at: string
}

export interface AggregatedAttendance {
  unit_id: string
  month: number
  year: number
  total_men: number
  total_women: number
  total_children: number
  total_attendance: number
  total_first_timers: number
  total_new_converts: number
  total_offering: number
  service_count: number
  branch_count: number
  generated_at: string
}

export interface Announcement {
  id: string
  denomination_id: string
  target_unit_id: string | null
  target_level: UnitLevel | null
  title: string
  body: string
  is_urgent: boolean
  created_by: string | null
  published_at: string | null
  expires_at: string | null
  created_at: string
}

// ============================================================
// UI / Form types
// ============================================================

export interface AttendanceFormData {
  service_date: string
  service_type: ServiceType
  men_count: number
  women_count: number
  children_count: number
  first_timers: number
  new_converts: number
  offering_amount?: number
  tithe_amount?: number
  testimony_notes?: string
  prayer_requests?: string
}

export interface DashboardStats {
  totalAttendance: number
  totalFirstTimers: number
  totalNewConverts: number
  totalOffering: number
  submittedBranches: number
  pendingBranches: number
  weekOverWeekChange: number
}

// ============================================================
// Service type display labels
// ============================================================

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  monday_fellowship: 'Monday Fellowship',
  thursday_bible_study: 'Thursday Bible Study',
  sunday_service: 'Sunday Service',
  special_service: 'Special Service',
  youth_service: 'Youth Service',
  womens_fellowship: "Women's Fellowship",
  mens_fellowship: "Men's Fellowship",
}

export const ROLE_LABELS: Record<UserRole, string> = {
  secretary: 'Branch Secretary',
  admin: 'Church Admin',
  coordinator: 'Group Coordinator',
  overseer: 'State Overseer',
  hq: 'National HQ',
  super_admin: 'Super Admin',
}

// Which role can see which level's dashboard
export const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  secretary: '/branch',
  admin: '/admin',
  coordinator: '/coordinator',
  overseer: '/overseer',
  hq: '/overseer', // HQ uses overseer-level UI for now
  super_admin: '/overseer',
}
