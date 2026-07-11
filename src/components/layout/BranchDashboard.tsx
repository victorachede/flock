'use client'

import type { UserProfile, AttendanceRecord } from '@/lib/types/database'
import { SERVICE_TYPE_LABELS } from '@/lib/types/database'
import { format } from 'date-fns'

interface Props {
  profile: UserProfile
  recentRecords: AttendanceRecord[]
}

// Status badge helper
function StatusBadge({ status }: { status: AttendanceRecord['status'] }) {
  const styles = {
    draft: 'bg-amber-50 text-amber-700 border-amber-200',
    submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    acknowledged: 'bg-green-50 text-green-700 border-green-200',
    queried: 'bg-red-50 text-red-700 border-red-200',
  }
  const labels = {
    draft: 'Draft',
    submitted: 'Submitted',
    acknowledged: 'Acknowledged',
    queried: 'Queried',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export function BranchDashboard({ profile, recentRecords }: Props) {
  const thisMonthRecords = recentRecords.filter(r => {
    const d = new Date(r.service_date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const totalAttendance = thisMonthRecords.reduce((acc, r) => acc + r.total_attendance, 0)
  const pendingSubmissions = recentRecords.filter(r => r.status === 'draft').length

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header */}
      <header className="bg-navy-800 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-navy-300 text-sm font-medium uppercase tracking-wider">Flock</p>
            <h1 className="text-lg font-semibold">{profile.unit?.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-navy-300">{profile.full_name}</p>
            <p className="text-xs text-navy-400">Branch Secretary</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card">
            <p className="text-sm text-navy-500 mb-1">This Month</p>
            <p className="text-3xl font-bold text-navy-900">{totalAttendance.toLocaleString()}</p>
            <p className="text-xs text-navy-400 mt-1">total attendance</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-navy-500 mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-600">{pendingSubmissions}</p>
            <p className="text-xs text-navy-400 mt-1">unsent records</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-navy-800 rounded-xl p-6 text-white">
          <h2 className="font-semibold text-lg mb-1">Record Today&apos;s Service</h2>
          <p className="text-navy-300 text-sm mb-4">
            Quick entry — takes about 2 minutes after service.
          </p>
          <a
            href="/branch/record"
            className="inline-block bg-gold-500 text-navy-900 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-gold-400 transition-colors"
          >
            + New Record
          </a>
        </div>

        {/* Recent records */}
        <section>
          <h2 className="text-sm font-semibold text-navy-500 uppercase tracking-wider mb-3">
            Recent Records
          </h2>
          {recentRecords.length === 0 ? (
            <div className="text-center py-12 text-navy-400">
              <p>No records yet. Record your first service above.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentRecords.map(record => (
                <div
                  key={record.id}
                  className="bg-white rounded-xl border border-navy-100 px-5 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-navy-900 text-sm">
                      {SERVICE_TYPE_LABELS[record.service_type]}
                    </p>
                    <p className="text-xs text-navy-400 mt-0.5">
                      {format(new Date(record.service_date), 'EEE, MMM d yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-navy-900">{record.total_attendance}</p>
                      <p className="text-xs text-navy-400">attendance</p>
                    </div>
                    <StatusBadge status={record.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
