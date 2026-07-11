import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flock — Church Administration for DLBC',
  description: 'Real-time attendance tracking and reporting for Deeper Life Bible Church branches, groups, and state leadership.',
  openGraph: {
    title: 'Flock — Ministry Administration Platform',
    description: 'Built for church structure. Attendance accountability from branch to state.',
    type: 'website',
  },
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
