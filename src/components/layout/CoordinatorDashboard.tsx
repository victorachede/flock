'use client'

import type { UserProfile, Unit, AggregatedAttendance } from '@/lib/types/database'

interface Props {
  profile: UserProfile
  childUnits: Unit[]
  currentMonthAggregate: AggregatedAttendance | null
}

export function CoordinatorDashboard({ profile, childUnits, currentMonthAggregate }: Props) {
  const now = new Date()
  const monthName = now.toLocaleString('default', { month: 'long' })

  return (
    <div className="min-h-screen bg-brand-surface">
      <header className="bg-navy-800 text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-navy-300 text-sm font-medium uppercase tracking-wider">Flock</p>
            <h1 className="text-lg font-semibold">{profile.unit?.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-navy-300">{profile.full_name}</p>
            <p className="text-xs text-navy-400">Group Coordinator</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Month aggregate */}
        <section>
          <h2 className="text-sm font-semibold text-navy-500 uppercase tracking-wider mb-3">
            {monthName} {now.getFullYear()} — Group Summary
          </h2>
          {currentMonthAggregate ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="stat-card">
                <p className="text-sm text-navy-500 mb-1">Total Attendance</p>
                <p className="text-3xl font-bold text-navy-900">
                  {currentMonthAggregate.total_attendance.toLocaleString()}
                </p>
              </div>
              <div className="stat-card">
                <p className="text-sm text-navy-500 mb-1">First Timers</p>
                <p className="text-3xl font-bold text-gold-600">
                  {currentMonthAggregate.total_first_timers}
                </p>
              </div>
              <div className="stat-card">
                <p className="text-sm text-navy-500 mb-1">New Converts</p>
                <p className="text-3xl font-bold text-green-600">
                  {currentMonthAggregate.total_new_converts}
                </p>
              </div>
              <div className="stat-card">
                <p className="text-sm text-navy-500 mb-1">Branches Reporting</p>
                <p className="text-3xl font-bold text-navy-900">
                  {currentMonthAggregate.branch_count}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-navy-100 p-8 text-center text-navy-400">
              No submissions yet this month.
            </div>
          )}
        </section>

        {/* Church units */}
        <section>
          <h2 className="text-sm font-semibold text-navy-500 uppercase tracking-wider mb-3">
            Churches in Your Group ({childUnits.length})
          </h2>
          <div className="space-y-2">
            {childUnits.map(unit => (
              <div
                key={unit.id}
                className="bg-white rounded-xl border border-navy-100 px-5 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-navy-900">{unit.name}</p>
                  <p className="text-xs text-navy-400 mt-0.5">{unit.city}</p>
                </div>
                <a
                  href={`/coordinator/church/${unit.id}`}
                  className="text-sm text-navy-600 font-medium hover:text-navy-800 transition-colors"
                >
                  View →
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
