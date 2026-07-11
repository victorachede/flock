import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CoordinatorDashboard } from '@/components/layout/CoordinatorDashboard'

export default async function CoordinatorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*, unit:units(*), denomination:denominations(*)')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'coordinator') redirect('/')

  // Get all child units (churches in this group)
  const { data: childUnits } = await supabase
    .from('units')
    .select('*')
    .eq('parent_id', profile.unit_id)
    .eq('is_active', true)

  // Current month aggregate
  const now = new Date()
  const { data: aggregate } = await supabase
    .rpc('aggregate_unit_attendance', {
      p_unit_id: profile.unit_id,
      p_month: now.getMonth() + 1,
      p_year: now.getFullYear(),
    })

  return (
    <CoordinatorDashboard
      profile={profile}
      childUnits={childUnits ?? []}
      currentMonthAggregate={aggregate}
    />
  )
}
