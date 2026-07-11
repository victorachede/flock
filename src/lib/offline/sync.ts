import { offlineDB } from './db'
import { createClient } from '@/lib/supabase/client'

export async function syncPendingRecords(unitId: string) {
  const supabase = createClient()
  const pending = await offlineDB.attendance
    .where({ unit_id: unitId, synced: false })
    .toArray()

  let synced = 0
  let failed = 0
  const errors: string[] = []

  for (const record of pending) {
    const { error } = await supabase.from('attendance_records').upsert({
      unit_id: record.unit_id,
      service_date: record.service_date,
      service_type: record.service_type,
      men_count: record.men_count,
      women_count: record.women_count,
      children_count: record.children_count,
      first_timers: record.first_timers,
      new_converts: record.new_converts,
      offering_amount: record.offering_amount ?? null,
      tithe_amount: record.tithe_amount ?? null,
      testimony_notes: record.testimony_notes ?? null,
      prayer_requests: record.prayer_requests ?? null,
      status: 'submitted',
      offline_id: record.id,
      created_offline: true,
    }, {
      onConflict: 'unit_id,service_date,service_type',
      ignoreDuplicates: true,
    })

    if (error) {
      failed++
      errors.push(`${record.service_date}: ${error.message}`)
      await offlineDB.attendance.update(record.id, { sync_error: error.message })
    } else {
      synced++
      await offlineDB.attendance.update(record.id, { synced: true, sync_error: null })
    }
  }

  return { synced, failed, errors }
}

export async function getPendingCount(unitId: string): Promise<number> {
  return offlineDB.attendance.where({ unit_id: unitId, synced: false }).count()
}
