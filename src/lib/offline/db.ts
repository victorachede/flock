import Dexie, { Table } from 'dexie'
import type { ServiceType } from '@/lib/types/database'

export interface OfflineAttendanceRecord {
  id: string
  unit_id: string
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
  synced: boolean
  sync_error: string | null
  created_at: string
}

export class FlockOfflineDB extends Dexie {
  attendance!: Table<OfflineAttendanceRecord>

  constructor() {
    super('flock-offline')
    this.version(1).stores({
      attendance: 'id, unit_id, synced, [unit_id+service_date+service_type]',
    })
  }
}

export const offlineDB = new FlockOfflineDB()
