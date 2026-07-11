'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ServiceType } from '@/lib/types/database'
import { SERVICE_TYPE_LABELS } from '@/lib/types/database'
import { createClient } from '@/lib/supabase/client'
import { offlineDB } from '@/lib/offline/db'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  unitId: string
  trackOfferings: boolean
  trackTestimonies: boolean
  activeServiceTypes: ServiceType[]
}

export function AttendanceForm({ unitId, trackOfferings, trackTestimonies, activeServiceTypes }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [savedOffline, setSavedOffline] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    const form = e.currentTarget
    const data = new FormData(form)

    const record = {
      unit_id: unitId,
      service_date: data.get('service_date') as string,
      service_type: data.get('service_type') as ServiceType,
      men_count: parseInt(data.get('men_count') as string) || 0,
      women_count: parseInt(data.get('women_count') as string) || 0,
      children_count: parseInt(data.get('children_count') as string) || 0,
      first_timers: parseInt(data.get('first_timers') as string) || 0,
      new_converts: parseInt(data.get('new_converts') as string) || 0,
      offering_amount: parseFloat(data.get('offering_amount') as string) || undefined,
      testimony_notes: data.get('testimony_notes') as string || undefined,
      prayer_requests: data.get('prayer_requests') as string || undefined,
      status: 'submitted' as const,
    }

    // Try online first
    const supabase = createClient()
    const { error } = await supabase.from('attendance_records').upsert(record, {
      onConflict: 'unit_id,service_date,service_type',
    })

    if (error) {
      // Network failure — queue offline
      await offlineDB.attendance.add({
        id: uuidv4(),
        ...record,
        synced: false,
        sync_error: null,
        created_at: new Date().toISOString(),
      })
      setSavedOffline(true)
    }

    setSaving(false)

    if (!error) {
      router.push('/branch?submitted=1')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedOffline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          No internet connection. Record saved locally and will sync automatically when you&apos;re back online.
        </div>
      )}

      <div className="bg-white rounded-xl border border-navy-100 p-5 space-y-5">
        <h2 className="font-semibold text-navy-900">Service Details</h2>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1.5">Date</label>
          <input
            type="date"
            name="service_date"
            defaultValue={today}
            required
            className="w-full border border-navy-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1.5">Service Type</label>
          <select
            name="service_type"
            required
            className="w-full border border-navy-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          >
            {activeServiceTypes.map(type => (
              <option key={type} value={type}>{SERVICE_TYPE_LABELS[type]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 p-5 space-y-5">
        <h2 className="font-semibold text-navy-900">Attendance</h2>

        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'men_count', label: 'Men' },
            { name: 'women_count', label: 'Women' },
            { name: 'children_count', label: 'Children' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">{label}</label>
              <input
                type="number"
                name={name}
                min="0"
                defaultValue="0"
                required
                className="w-full border border-navy-200 rounded-lg px-3 py-2.5 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">First Timers</label>
            <input
              type="number"
              name="first_timers"
              min="0"
              defaultValue="0"
              className="w-full border border-navy-200 rounded-lg px-3 py-2.5 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">New Converts</label>
            <input
              type="number"
              name="new_converts"
              min="0"
              defaultValue="0"
              className="w-full border border-navy-200 rounded-lg px-3 py-2.5 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
        </div>
      </div>

      {trackOfferings && (
        <div className="bg-white rounded-xl border border-navy-100 p-5">
          <h2 className="font-semibold text-navy-900 mb-4">Offerings (₦)</h2>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Total Offering</label>
            <input
              type="number"
              name="offering_amount"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full border border-navy-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
        </div>
      )}

      {trackTestimonies && (
        <div className="bg-white rounded-xl border border-navy-100 p-5 space-y-4">
          <h2 className="font-semibold text-navy-900">Notes</h2>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Testimonies / Notable Events</label>
            <textarea
              name="testimony_notes"
              rows={3}
              placeholder="Any notable testimonies or events from today's service..."
              className="w-full border border-navy-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Prayer Requests to Escalate</label>
            <textarea
              name="prayer_requests"
              rows={2}
              placeholder="Any prayer items for the church admin or coordinator..."
              className="w-full border border-navy-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-navy-800 text-white font-semibold py-3 rounded-xl hover:bg-navy-700 disabled:opacity-60 transition-colors"
      >
        {saving ? 'Saving...' : 'Submit Record'}
      </button>
    </form>
  )
}
