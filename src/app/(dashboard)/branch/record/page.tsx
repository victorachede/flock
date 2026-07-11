import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AttendanceForm } from '@/components/forms/AttendanceForm'

export default async function RecordAttendancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*, unit:units(*), denomination:denominations(*)')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'secretary') redirect('/')

  return (
    <div className="min-h-screen bg-brand-surface">
      <header className="bg-navy-800 text-white px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <a href="/branch" className="text-navy-300 hover:text-white transition-colors">
            ← Back
          </a>
          <h1 className="text-lg font-semibold">Record Service</h1>
        </div>
      </header>
      <main className="max-w-xl mx-auto px-6 py-8">
        <AttendanceForm
          unitId={profile.unit_id}
          trackOfferings={profile.denomination?.track_offerings ?? true}
          trackTestimonies={profile.denomination?.track_testimonies ?? true}
          activeServiceTypes={profile.denomination?.active_service_types ?? ['sunday_service']}
        />
      </main>
    </div>
  )
}
