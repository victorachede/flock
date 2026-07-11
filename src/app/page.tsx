import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROLE_DASHBOARD_MAP, UserRole } from '@/lib/types/database'

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Show landing page for unauthenticated visitors
  if (!user) redirect('/home')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, onboarding_complete')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (!profile.onboarding_complete) redirect('/onboarding')

  redirect(ROLE_DASHBOARD_MAP[profile.role as UserRole])
}
