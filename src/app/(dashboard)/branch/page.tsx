import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BranchDashboard } from '@/components/layout/BranchDashboard'

export default async function BranchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*, unit:units(*), denomination:denominations(*)')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'secretary') redirect('/')

  // Recent attendance records for this branch
  const { data: recentRecords } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('unit_id', profile.unit_id)
    .order('service_date', { ascending: false })
    .limit(10)

  return <BranchDashboard profile={profile} recentRecords={recentRecords ?? []} />
}
