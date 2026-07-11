# Flock

**Church administration platform for Nigerian denominations.**

Real-time attendance tracking, report aggregation, and hierarchy management — built for DLBC first, designed for every denomination.

---

## The Problem

Branch secretaries record attendance in physical books all month, then batch-submit at month end via WhatsApp. This flows up a 4-level hierarchy manually: Branch → Church → Group → State → Lagos HQ. By the time leadership sees a trend, it's months old and filtered through multiple human handoffs.

Flock eliminates the lag. Branch secretaries submit after every service. Coordinators and Overseers see it in real time.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (Postgres + Realtime + Auth)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Offline**: Dexie.js (IndexedDB) for offline-first data entry
- **Reports**: `@react-pdf/renderer` (planned)

---

## Role Hierarchy (DLBC)

| Role | Unit Level | Primary Job |
|------|-----------|-------------|
| Secretary | Branch | Record attendance after each service |
| Admin | Church | Aggregate branches, forward monthly |
| Coordinator | Group | Aggregate churches, review trends |
| Overseer | State | State-wide visibility, forward to HQ |
| HQ | National | National analytics (read-only) |

---

## Key Design Decisions

### Offline-first data entry
Branch secretaries in rural Nigeria often have poor connectivity. Attendance records are first written to IndexedDB (Dexie) and sync to Supabase when online. The unique constraint `(unit_id, service_date, service_type)` prevents duplicates on sync.

### Frozen report snapshots
When a coordinator "forwards" a monthly report, the aggregated data is frozen as JSONB in `report_periods.compiled_data`. This creates an audit trail — data changes after submission don't retroactively alter forwarded reports.

### Configurable hierarchy
The hierarchy depth and level names are configurable per denomination (`denominations.level_names`). RCCG, Winners Chapel, MFM etc. can all be onboarded without schema changes.

### Recursive aggregation
`get_descendant_unit_ids(root_id)` is a recursive CTE that returns all unit IDs below a given node. All coordinator/overseer queries use this to aggregate down the tree correctly.

---

## Getting Started

```bash
# Clone and install
git clone https://github.com/victorachede/flock
cd flock
npm install

# Configure environment
cp .env.example .env.local
# Fill in your Supabase URL and keys

# Run Supabase migrations
supabase db push

# Start dev server
npm run dev
```

---

## Roadmap

### Phase 1 — DLBC Benue Pilot
- [x] Database schema + RLS
- [x] Branch secretary attendance form (offline-first)
- [x] Group coordinator dashboard
- [ ] Month-end report generation (PDF)
- [ ] Church admin aggregation view
- [ ] State Overseer dashboard
- [ ] Realtime submission notifications

### Phase 2 — DLBC State Rollout
- [ ] Bulk branch onboarding (CSV import)
- [ ] WhatsApp notification integration (Twilio / Africa's Talking)
- [ ] Mobile app (React Native / Expo)
- [ ] Offering trend analytics

### Phase 3 — Multi-Denomination
- [ ] Denomination onboarding flow (self-serve)
- [ ] Custom service type configuration
- [ ] RCCG pilot
- [ ] National dashboard for HQ users

---

## Pricing Strategy

| Tier | Price | Who Pays |
|------|-------|----------|
| Branch | ₦2,000/month | Branch or subsidized by church |
| Group | ₦15,000/month | Group Coordinator budget |
| State | ₦80,000/month | State administration budget |
| National | Custom | Denomination HQ |

Pilot period (first 3 months) is free.

---

## Project Context

Built by [Victor Achede](https://github.com/victorachede), 18-year-old solo founder from Makurdi, Benue State, Nigeria.

Part of a broader platform suite alongside [ASKTC](https://asktc.live) — live event Q&A for churches and conferences.

Go-to-market beachhead: DLBC Benue State (existing relationship with State Overseer via ASKTC deployment at GCK events; father is a Group Coordinator).
