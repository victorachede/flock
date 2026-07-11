'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ─── Animated SVG: Hierarchy Flow ─────────────────────────────────────────────
// Draws three nodes connected by animated flowing lines, simulating live data
// flowing up the church hierarchy from branch → group → state
function HierarchySVG() {
  return (
    <svg
      viewBox="0 0 280 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[280px] mx-auto"
      aria-hidden="true"
    >
      <defs>
        {/* Flowing dash animation going upward */}
        <style>{`
          @keyframes flowUp {
            0%   { stroke-dashoffset: 48; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes pulse-ring {
            0%, 100% { opacity: 0.15; r: 20; }
            50%       { opacity: 0.35; r: 26; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .node-label { animation: fadeIn 0.6s ease both; }
          .node-label-1 { animation-delay: 0.1s; }
          .node-label-2 { animation-delay: 0.35s; }
          .node-label-3 { animation-delay: 0.6s; }
          .flow-line-1 { animation: flowUp 1.2s linear infinite; animation-delay: 0s; }
          .flow-line-2 { animation: flowUp 1.2s linear infinite; animation-delay: 0.4s; }
          .pulse-1 { animation: pulse-ring 2.4s ease-in-out infinite; animation-delay: 0s; }
          .pulse-2 { animation: pulse-ring 2.4s ease-in-out infinite; animation-delay: 0.8s; }
          .pulse-3 { animation: pulse-ring 2.4s ease-in-out infinite; animation-delay: 1.6s; }
        `}</style>

        {/* Clip so pulses don't overflow */}
        <clipPath id="svgClip">
          <rect width="280" height="320" />
        </clipPath>
      </defs>

      <g clipPath="url(#svgClip)">
        {/* ── Node 3 — Branch Secretary (bottom) ── */}
        {/* Pulse ring */}
        <circle className="pulse-3" cx="140" cy="256" r="20" stroke="white" strokeWidth="1" fill="none" />
        {/* Node circle */}
        <circle cx="140" cy="256" r="14" fill="white" />
        <circle cx="140" cy="256" r="8" fill="black" />
        {/* Label */}
        <text className="node-label node-label-1" x="140" y="285" textAnchor="middle"
              fontSize="11" fill="white" fontFamily="Plus Jakarta Sans, Inter, sans-serif"
              fontWeight="600" letterSpacing="0.02em">
          Branch Secretary
        </text>
        <text x="140" y="298" textAnchor="middle"
              fontSize="9" fill="rgba(255,255,255,0.35)"
              fontFamily="Plus Jakarta Sans, Inter, sans-serif">
          records attendance
        </text>

        {/* ── Flow line 1: branch → group ── */}
        {/* Static track */}
        <line x1="140" y1="242" x2="140" y2="178"
              stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {/* Animated flow */}
        <line className="flow-line-1"
              x1="140" y1="242" x2="140" y2="178"
              stroke="white" strokeWidth="1.5"
              strokeDasharray="6 42"
              strokeDashoffset="48"
              strokeLinecap="round" />

        {/* ── Node 2 — Group Coordinator (middle) ── */}
        <circle className="pulse-2" cx="140" cy="164" r="20" stroke="white" strokeWidth="1" fill="none" />
        <circle cx="140" cy="164" r="14" fill="white" />
        <circle cx="140" cy="164" r="8" fill="black" />
        <text className="node-label node-label-2" x="140" y="143" textAnchor="middle"
              fontSize="11" fill="white" fontFamily="Plus Jakarta Sans, Inter, sans-serif"
              fontWeight="600" letterSpacing="0.02em">
          Group Coordinator
        </text>
        <text x="140" y="131" textAnchor="middle"
              fontSize="9" fill="rgba(255,255,255,0.35)"
              fontFamily="Plus Jakarta Sans, Inter, sans-serif">
          monitors branches
        </text>

        {/* ── Flow line 2: group → state ── */}
        <line x1="140" y1="150" x2="140" y2="86"
              stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <line className="flow-line-2"
              x1="140" y1="150" x2="140" y2="86"
              stroke="white" strokeWidth="1.5"
              strokeDasharray="6 42"
              strokeDashoffset="48"
              strokeLinecap="round" />

        {/* ── Node 1 — State Overseer (top) ── */}
        <circle className="pulse-1" cx="140" cy="72" r="20" stroke="white" strokeWidth="1" fill="none" />
        <circle cx="140" cy="72" r="14" fill="white" />
        <circle cx="140" cy="72" r="8" fill="black" />
        <text className="node-label node-label-3" x="140" y="50" textAnchor="middle"
              fontSize="11" fill="white" fontFamily="Plus Jakarta Sans, Inter, sans-serif"
              fontWeight="600" letterSpacing="0.02em">
          State Overseer
        </text>
        <text x="140" y="38" textAnchor="middle"
              fontSize="9" fill="rgba(255,255,255,0.35)"
              fontFamily="Plus Jakarta Sans, Inter, sans-serif">
          full visibility
        </text>
      </g>
    </svg>
  )
}

// ─── Animated SVG: Live Attendance Bars ───────────────────────────────────────
// A minimal bar chart that animates in, suggesting real-time data
function AttendanceSVG() {
  const bars = [
    { week: 'W1', h: 52, delay: 0 },
    { week: 'W2', h: 70, delay: 80 },
    { week: 'W3', h: 44, delay: 160 },
    { week: 'W4', h: 88, delay: 240 },
    { week: 'W5', h: 62, delay: 320 },
    { week: 'W6', h: 96, delay: 400 },
  ]
  const [visible, setVisible] = useState(false)
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const maxH = 96
  const svgH = 120
  const barW = 28
  const gap = 14
  const total = bars.length
  const totalW = total * barW + (total - 1) * gap
  const startX = (200 - totalW) / 2

  return (
    <svg ref={ref} viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg"
         className="w-full max-w-[200px] mx-auto" aria-hidden="true">
      {/* Baseline */}
      <line x1="0" y1={svgH} x2="200" y2={svgH} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {bars.map((b, i) => {
        const x = startX + i * (barW + gap)
        const barH = visible ? (b.h / maxH) * 90 : 0
        const y = svgH - barH

        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barW} height={barH}
              fill={i === bars.length - 1 ? 'white' : 'rgba(255,255,255,0.2)'}
              style={{
                transition: `height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), y 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                transitionDelay: `${b.delay}ms`,
              }}
            />
            <text x={x + barW / 2} y={svgH + 14} textAnchor="middle"
                  fontSize="8" fill="rgba(255,255,255,0.3)"
                  fontFamily="Plus Jakarta Sans, Inter, sans-serif">
              {b.week}
            </text>
          </g>
        )
      })}

      {/* Live badge */}
      <g style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease 0.8s' }}>
        <circle cx="187" cy="10" r="4" fill="white">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <text x="179" y="14" textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.5)"
              fontFamily="Plus Jakarta Sans, Inter, sans-serif">
          LIVE
        </text>
      </g>
    </svg>
  )
}

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
         style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-display text-white text-xl tracking-tight"
              style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
          Flock
        </span>
        <Link href="/login"
              className="text-sm text-white/50 hover:text-white transition-colors"
              style={{ fontWeight: 500 }}>
          Sign in
        </Link>
      </div>
    </nav>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 bg-black overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0"
           style={{
             backgroundImage: `
               linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
             `,
             backgroundSize: '64px 64px',
           }} />

      {/* Large ghost text — atmosphere */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden"
           aria-hidden="true">
        <span className="font-display text-white/[0.03] leading-none block"
              style={{ fontSize: 'clamp(8rem, 18vw, 22rem)', fontWeight: 900, letterSpacing: '-0.04em' }}>
          FLOCK
        </span>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center w-full">
        {/* Left */}
        <div>
          <p className="text-white/30 text-xs font-600 uppercase tracking-[0.2em] mb-8"
             style={{ fontWeight: 600 }}>
            Ministry Administration
          </p>

          <h1 className="font-display text-white leading-none mb-6"
              style={{
                fontWeight: 900,
                fontSize: 'clamp(2.75rem, 6.5vw, 5rem)',
                letterSpacing: '-0.04em',
              }}>
            Every branch.<br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>One clear</span><br />
            picture.
          </h1>

          <p className="text-white/40 mb-10 leading-relaxed"
             style={{ fontSize: '1.0625rem', maxWidth: '46ch', fontWeight: 400 }}>
            Real-time attendance visibility for DLBC State Overseers and Group Coordinators —
            from every branch, without chasing a single report.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:victor@asktc.live?subject=Flock Demo Request&body=Hi Victor, I'd like to learn more about Flock for our church."
               className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-display transition-all hover:bg-white/90 active:scale-95"
               style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.01em' }}>
              Request a Demo
            </a>
            <a href="#how-it-works"
               className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white/60 font-display transition-all hover:border-white/40 hover:text-white"
               style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
              See how it works
            </a>
          </div>

          <p className="mt-10 text-white/20 text-xs tracking-wide">
            Piloting with Benue Central State — DLBC
          </p>
        </div>

        {/* Right — animated hierarchy SVG */}
        <div className="flex flex-col items-center gap-8">
          <HierarchySVG />
        </div>
      </div>
    </section>
  )
}

// ─── Problem ───────────────────────────────────────────────────────────────────
function Problem() {
  const items = [
    {
      q: '"Where is the report from Branch 14?"',
      a: 'A coordinator shouldn\'t have to ask this.',
    },
    {
      q: '"Which groups are struggling this month?"',
      a: 'Leadership should see this without requesting it.',
    },
    {
      q: '"What was our total attendance last quarter?"',
      a: 'Aggregating branch sheets by hand wastes hours.',
    },
  ]

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-xl mb-16">
          <p className="text-black/30 text-xs font-600 uppercase tracking-[0.15em] mb-5"
             style={{ fontWeight: 600 }}>
            The Problem
          </p>
          <h2 className="font-display text-black leading-tight"
              style={{ fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}>
            Church leadership is flying blind on branch performance.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-black/10">
          {items.map((item, i) => (
            <div key={i} className="bg-white p-8">
              <p className="font-display text-black font-700 text-base mb-4 leading-snug"
                 style={{ fontWeight: 700 }}>
                {item.q}
              </p>
              <div className="w-5 h-px bg-black/20 mb-4" />
              <p className="text-black/40 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      role: 'Branch Secretary',
      action: 'Opens Flock on Sunday. Records attendance for Morning Glory, Sunday Service, Prayer Night. Takes 2 minutes. Works offline.',
      outcome: 'Data syncs automatically when internet returns.',
    },
    {
      role: 'Group Coordinator',
      action: 'Sees live attendance across all branches in real time. Spots which branches are consistent, which need follow-up.',
      outcome: 'No calls. No WhatsApp chasing. One dashboard.',
    },
    {
      role: 'State Overseer',
      action: 'Views aggregate attendance for the entire state. Downloads PDF reports by period, group, or branch.',
      outcome: 'Full accountability at every level of the hierarchy.',
    },
  ]

  return (
    <section id="how-it-works" className="bg-black py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: steps */}
          <div>
            <p className="text-white/30 text-xs font-600 uppercase tracking-[0.15em] mb-8"
               style={{ fontWeight: 600 }}>
              How it works
            </p>
            <h2 className="font-display text-white leading-tight mb-12"
                style={{ fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
              Built around the structure you already have.
            </h2>

            <div className="space-y-10">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 text-white/20 font-display text-3xl leading-none select-none"
                       style={{ fontWeight: 900 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <p className="font-display text-white font-700 mb-2" style={{ fontWeight: 700 }}>
                      {step.role}
                    </p>
                    <p className="text-white/40 text-sm leading-relaxed mb-2">{step.action}</p>
                    <p className="text-white/60 text-sm font-500" style={{ fontWeight: 500 }}>
                      → {step.outcome}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: attendance chart SVG */}
          <div className="border border-white/10 p-10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className="text-white/40 text-xs font-600 uppercase tracking-widest"
                 style={{ fontWeight: 600 }}>
                Group 4 · Attendance
              </p>
              <span className="text-white/20 text-xs">Benue Central</span>
            </div>
            <AttendanceSVG />
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[
                { label: 'Branches', val: '12' },
                { label: 'Avg. attendance', val: '68%' },
                { label: 'Reports filed', val: '11/12' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="font-display text-white text-xl font-800 leading-none mb-1"
                     style={{ fontWeight: 800 }}>
                    {s.val}
                  </p>
                  <p className="text-white/30 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Features ──────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      title: 'Offline-first recording',
      body: 'Branch secretaries record attendance without internet. Data syncs automatically when connectivity returns.',
    },
    {
      title: 'Automatic roll-ups',
      body: 'Attendance flows up the hierarchy. Group totals aggregate from branches. State totals aggregate from groups.',
    },
    {
      title: 'PDF period reports',
      body: 'Generate formatted attendance reports by week, month, or quarter — for any branch, group, or the full state.',
    },
    {
      title: 'Multi-meeting tracking',
      body: 'Track Morning Glory, Sunday Service, Prayer Night separately with per-meeting trends.',
    },
    {
      title: 'Role-based access',
      body: 'Branch secretaries see their branch. Coordinators see their group. Overseers see everything.',
    },
    {
      title: 'Announcement board',
      body: 'Leadership communicates directives down the hierarchy. Each role sees what\'s relevant to them.',
    },
  ]

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-black/30 text-xs font-600 uppercase tracking-[0.15em] mb-5"
               style={{ fontWeight: 600 }}>
              What's included
            </p>
            <h2 className="font-display text-black leading-tight"
                style={{ fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}>
              Everything a church needs.<br />Nothing it doesn't.
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8"
             style={{ background: 'rgba(0,0,0,0.08)' }}>
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8">
              {/* Thin top rule as visual identity */}
              <div className="w-6 h-0.5 bg-black mb-6" />
              <p className="font-display text-black font-700 mb-3" style={{ fontWeight: 700 }}>
                {f.title}
              </p>
              <p className="text-black/40 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="bg-black py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="border border-white/10 p-12 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-lg">
            <h2 className="font-display text-white leading-tight mb-4"
                style={{ fontWeight: 900, fontSize: 'clamp(2rem, 4.5vw, 3rem)', letterSpacing: '-0.04em' }}>
              Start with your group.<br />
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>Scale to your state.</span>
            </h2>
            <p className="text-white/30 leading-relaxed text-sm max-w-[44ch]">
              Piloting with select DLBC groups in Benue State. If you lead a group or oversee a state,
              reach out to arrange a demonstration with your branch secretaries.
            </p>
          </div>
          <div className="flex-shrink-0">
            <a href="mailto:victor@asktc.live?subject=Flock Demo Request&body=Hi Victor, I'd like to learn more about Flock for our church."
               className="inline-flex items-center justify-center px-10 py-4 bg-white text-black font-display transition-all hover:bg-white/90 active:scale-95 whitespace-nowrap"
               style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
              Request a Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-black py-10 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-display text-white text-lg" style={{ fontWeight: 800 }}>Flock</span>
          <p className="text-white/20 text-xs mt-1">Church administration infrastructure</p>
        </div>
        <p className="text-white/15 text-xs">Built by Black Sheep Co. · Makurdi, Nigeria</p>
      </div>
    </footer>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main style={{ fontFamily: 'var(--font-jakarta), Inter, system-ui, sans-serif' }}>
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </main>
  )
}
