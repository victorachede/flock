'use client'

import { useEffect, useRef, useState } from 'react'

const F = 'Plus Jakarta Sans, Inter, system-ui, sans-serif'

// ─── Hierarchy SVG ────────────────────────────────────────────────────────────
function HierarchySVG() {
  return (
    <svg viewBox="0 0 260 300" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={{ width: '100%', maxWidth: 260 }} aria-hidden="true">
      <defs>
        <style>{`
          @keyframes flowUp { 0% { stroke-dashoffset: 48 } 100% { stroke-dashoffset: 0 } }
          @keyframes pulseRing { 0%,100% { opacity:.12; r:18 } 50% { opacity:.28; r:23 } }
          @keyframes fadeSlide { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
          .fl1 { animation: flowUp 1.4s linear infinite }
          .fl2 { animation: flowUp 1.4s linear infinite; animation-delay:.5s }
          .pr1 { animation: pulseRing 2.8s ease-in-out infinite }
          .pr2 { animation: pulseRing 2.8s ease-in-out infinite; animation-delay:.9s }
          .pr3 { animation: pulseRing 2.8s ease-in-out infinite; animation-delay:1.8s }
          .fd1 { animation: fadeSlide .6s ease both }
          .fd2 { animation: fadeSlide .6s .25s ease both }
          .fd3 { animation: fadeSlide .6s .5s ease both }
        `}</style>
      </defs>

      {/* Node 3 — Branch */}
      <circle className="pr3" cx="130" cy="240" r="18" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="130" cy="240" r="13" fill="white"/>
      <circle cx="130" cy="240" r="7" fill="black"/>
      <text className="fd1" x="130" y="264" textAnchor="middle" fontSize="10.5" fill="white" fontFamily={F} fontWeight="600">Branch Secretary</text>
      <text x="130" y="276" textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,.3)" fontFamily={F}>records attendance</text>

      {/* Line 1 */}
      <line x1="130" y1="227" x2="130" y2="168" stroke="rgba(255,255,255,.1)" strokeWidth="1.5"/>
      <line className="fl1" x1="130" y1="227" x2="130" y2="168" stroke="white" strokeWidth="1.5" strokeDasharray="5 43" strokeDashoffset="48" strokeLinecap="round"/>

      {/* Node 2 — Coordinator */}
      <circle className="pr2" cx="130" cy="155" r="18" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="130" cy="155" r="13" fill="white"/>
      <circle cx="130" cy="155" r="7" fill="black"/>
      <text className="fd2" x="130" y="134" textAnchor="middle" fontSize="10.5" fill="white" fontFamily={F} fontWeight="600">Group Coordinator</text>
      <text x="130" y="122" textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,.3)" fontFamily={F}>monitors branches</text>

      {/* Line 2 */}
      <line x1="130" y1="142" x2="130" y2="83" stroke="rgba(255,255,255,.1)" strokeWidth="1.5"/>
      <line className="fl2" x1="130" y1="142" x2="130" y2="83" stroke="white" strokeWidth="1.5" strokeDasharray="5 43" strokeDashoffset="48" strokeLinecap="round"/>

      {/* Node 1 — Overseer */}
      <circle className="pr1" cx="130" cy="70" r="18" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="130" cy="70" r="13" fill="white"/>
      <circle cx="130" cy="70" r="7" fill="black"/>
      <text className="fd3" x="130" y="49" textAnchor="middle" fontSize="10.5" fill="white" fontFamily={F} fontWeight="600">State Overseer</text>
      <text x="130" y="37" textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,.3)" fontFamily={F}>full visibility</text>
    </svg>
  )
}

// ─── Bar Chart SVG ────────────────────────────────────────────────────────────
function AttendanceSVG() {
  const bars = [
    { w: 'W1', h: 52, delay: 0 },
    { w: 'W2', h: 70, delay: 80 },
    { w: 'W3', h: 44, delay: 160 },
    { w: 'W4', h: 88, delay: 240 },
    { w: 'W5', h: 62, delay: 320 },
    { w: 'W6', h: 96, delay: 400 },
  ]
  const [visible, setVisible] = useState(false)
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const bW = 26, gap = 12, svgH = 100
  const totalW = bars.length * bW + (bars.length - 1) * gap
  const startX = (200 - totalW) / 2

  return (
    <svg ref={ref} viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={{ width: '100%', maxWidth: 200, margin: '0 auto', display: 'block' }} aria-hidden="true">
      <line x1="0" y1={svgH} x2="200" y2={svgH} stroke="rgba(255,255,255,.08)" strokeWidth="1"/>
      {bars.map((b, i) => {
        const x = startX + i * (bW + gap)
        const barH = visible ? (b.h / 96) * 82 : 0
        const y = svgH - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={bW} height={barH}
                  fill={i === bars.length - 1 ? 'white' : 'rgba(255,255,255,.2)'}
                  style={{ transition: `height .6s cubic-bezier(.34,1.56,.64,1) ${b.delay}ms, y .6s cubic-bezier(.34,1.56,.64,1) ${b.delay}ms` }}/>
            <text x={x + bW / 2} y={svgH + 14} textAnchor="middle" fontSize="8"
                  fill="rgba(255,255,255,.25)" fontFamily={F}>{b.w}</text>
          </g>
        )
      })}
      <g style={{ opacity: visible ? 1 : 0, transition: 'opacity .4s ease .8s' }}>
        <circle cx="188" cy="10" r="4" fill="white">
          <animate attributeName="opacity" values="1;0.25;1" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <text x="180" y="14" textAnchor="end" fontSize="7.5" fill="rgba(255,255,255,.4)" fontFamily={F}>LIVE</text>
      </g>
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const s = {
    // layout
    page: { fontFamily: F, margin: 0, padding: 0, background: '#fff', color: '#000' },
    // nav
    nav: { position: 'fixed' as const, top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 60 },
    navLogo: { fontFamily: F, fontWeight: 900, fontSize: 20, color: '#fff', letterSpacing: '-0.03em', textDecoration: 'none' },
    navLink: { fontFamily: F, fontWeight: 500, fontSize: 13.5, color: 'rgba(255,255,255,.45)', textDecoration: 'none' },
    // hero
    hero: { background: '#000', minHeight: '100vh', paddingTop: 60, display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative' as const },
    heroGrid: { position: 'absolute' as const, inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize: '64px 64px' },
    heroInner: { maxWidth: 1024, margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', width: '100%', position: 'relative' as const },
    heroEyebrow: { fontFamily: F, fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,.28)', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 28 },
    heroH1: { fontFamily: F, fontWeight: 900, fontSize: 'clamp(2.6rem, 6vw, 4.8rem)', color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.0, marginBottom: 24 },
    heroSub: { fontFamily: F, fontWeight: 400, fontSize: 16.5, color: 'rgba(255,255,255,.38)', lineHeight: 1.65, maxWidth: '46ch', marginBottom: 36 },
    heroCtas: { display: 'flex', gap: 12, flexWrap: 'wrap' as const },
    ctaPrimary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 32px', background: '#fff', color: '#000', fontFamily: F, fontWeight: 700, fontSize: 14.5, letterSpacing: '-0.01em', textDecoration: 'none', cursor: 'pointer' },
    ctaSecondary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 32px', border: '1px solid rgba(255,255,255,.18)', color: 'rgba(255,255,255,.55)', fontFamily: F, fontWeight: 600, fontSize: 14.5, textDecoration: 'none', cursor: 'pointer' },
    heroPilot: { fontFamily: F, fontSize: 12, color: 'rgba(255,255,255,.18)', marginTop: 32, letterSpacing: '0.04em' },
    // problem
    problem: { background: '#fff', padding: '88px 24px' },
    sectionInner: { maxWidth: 1024, margin: '0 auto' },
    eyebrow: { fontFamily: F, fontWeight: 600, fontSize: 11, color: 'rgba(0,0,0,.28)', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 20 },
    sectionH2: { fontFamily: F, fontWeight: 800, fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', color: '#000', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 48 },
    problemGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(0,0,0,.1)' },
    problemCard: { background: '#fff', padding: 32 },
    problemQ: { fontFamily: F, fontWeight: 700, fontSize: 15, color: '#000', marginBottom: 16, lineHeight: 1.4 },
    problemDivider: { width: 24, height: 1, background: 'rgba(0,0,0,.15)', marginBottom: 14 },
    problemA: { fontFamily: F, fontWeight: 400, fontSize: 13.5, color: 'rgba(0,0,0,.38)', lineHeight: 1.6 },
    // how it works
    how: { background: '#000', padding: '88px 24px' },
    howGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' },
    eyebrowWhite: { fontFamily: F, fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,.28)', letterSpacing: '0.18em', textTransform: 'uppercase' as const, marginBottom: 20 },
    howH2: { fontFamily: F, fontWeight: 800, fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 44 },
    step: { display: 'flex', gap: 20, marginBottom: 36 },
    stepNum: { fontFamily: F, fontWeight: 900, fontSize: 28, color: 'rgba(255,255,255,.1)', lineHeight: 1, flexShrink: 0, width: 36 },
    stepRole: { fontFamily: F, fontWeight: 700, fontSize: 14.5, color: '#fff', marginBottom: 6 },
    stepAction: { fontFamily: F, fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,.38)', lineHeight: 1.6, marginBottom: 6 },
    stepOutcome: { fontFamily: F, fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,.55)' },
    chartBox: { border: '1px solid rgba(255,255,255,.1)', padding: 32 },
    chartLabel: { fontFamily: F, fontWeight: 600, fontSize: 10, color: 'rgba(255,255,255,.35)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: 4 },
    chartSub: { fontFamily: F, fontSize: 11, color: 'rgba(255,255,255,.18)', marginBottom: 24 },
    chartStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 20, marginTop: 20 },
    statNum: { fontFamily: F, fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 4 },
    statLabel: { fontFamily: F, fontSize: 11, color: 'rgba(255,255,255,.28)' },
    // features
    features: { background: '#fff', padding: '88px 24px' },
    featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(0,0,0,.08)' },
    featureCard: { background: '#fff', padding: 32 },
    featureRule: { width: 24, height: 2, background: '#000', marginBottom: 20 },
    featureTitle: { fontFamily: F, fontWeight: 700, fontSize: 14.5, color: '#000', marginBottom: 10 },
    featureBody: { fontFamily: F, fontSize: 13, color: 'rgba(0,0,0,.38)', lineHeight: 1.65 },
    // cta
    cta: { background: '#000', padding: '88px 24px' },
    ctaBox: { border: '1px solid rgba(255,255,255,.1)', padding: '56px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap' as const },
    ctaH2: { fontFamily: F, fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 16 },
    ctaSub: { fontFamily: F, fontSize: 13.5, color: 'rgba(255,255,255,.28)', lineHeight: 1.65, maxWidth: '44ch' },
    // footer
    footer: { background: '#000', borderTop: '1px solid rgba(255,255,255,.05)', padding: '36px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 16 },
    footerLogo: { fontFamily: F, fontWeight: 900, fontSize: 17, color: '#fff' },
    footerSub: { fontFamily: F, fontSize: 11, color: 'rgba(255,255,255,.18)', marginTop: 4 },
    footerRight: { fontFamily: F, fontSize: 11, color: 'rgba(255,255,255,.14)' },
  }

  const problems = [
    { q: '"Where is the report from Branch 14?"', a: "A coordinator shouldn't have to ask this." },
    { q: '"Which groups are struggling this month?"', a: 'Leadership should see this without requesting it.' },
    { q: '"What was our total attendance last quarter?"', a: 'Aggregating branch sheets by hand wastes hours.' },
  ]
  const steps = [
    { role: 'Branch Secretary', action: 'Opens Flock on Sunday. Records attendance for Morning Glory, Sunday Service, Prayer Night. Takes 2 minutes. Works offline.', outcome: '→ Data syncs automatically.' },
    { role: 'Group Coordinator', action: 'Sees live attendance across all branches in real time. Spots which branches need follow-up.', outcome: '→ No calls. No WhatsApp chasing.' },
    { role: 'State Overseer', action: 'Views aggregate attendance for the entire state. Downloads PDF reports by period, group, or branch.', outcome: '→ Full accountability at every level.' },
  ]
  const feats = [
    { t: 'Offline-first recording', b: 'Branch secretaries record attendance without internet. Syncs automatically when connectivity returns.' },
    { t: 'Automatic roll-ups', b: 'Attendance flows up the hierarchy. Group totals from branches. State totals from groups.' },
    { t: 'PDF period reports', b: 'Formatted attendance reports by week, month, or quarter — for any branch, group, or state.' },
    { t: 'Multi-meeting tracking', b: 'Track Morning Glory, Sunday Service, Prayer Night separately with per-meeting trends.' },
    { t: 'Role-based access', b: 'Branch secretaries see their branch. Coordinators see their group. Overseers see everything.' },
    { t: 'Announcement board', b: "Leadership communicates directives down the hierarchy. Each role sees what's relevant to them." },
  ]

  const DEMO_HREF = 'mailto:victor@asktc.live?subject=Flock Demo Request&body=Hi Victor, I\'d like to learn more about Flock for our church.'

  return (
    <div style={s.page}>
      {/* NAV */}
      <nav style={s.nav}>
        <span style={s.navLogo}>Flock</span>
        <a href="/login" style={s.navLink}>Sign in</a>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroGrid} />
        <div style={s.heroInner}>
          <div>
            <p style={s.heroEyebrow}>Ministry Administration</p>
            <h1 style={s.heroH1}>Every branch.<br /><span style={{ color: 'rgba(255,255,255,.35)' }}>One clear<br />picture.</span></h1>
            <p style={s.heroSub}>Real-time attendance visibility for DLBC State Overseers and Group Coordinators — from every branch, without chasing a single report.</p>
            <div style={s.heroCtas}>
              <a href={DEMO_HREF} style={s.ctaPrimary}>Request a Demo</a>
              <a href="#how" style={s.ctaSecondary}>See how it works</a>
            </div>
            <p style={s.heroPilot}>Piloting with Benue Central State — DLBC</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HierarchySVG />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={s.problem}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>The Problem</p>
          <h2 style={s.sectionH2}>Church leadership is flying blind<br />on branch performance.</h2>
          <div style={s.problemGrid}>
            {problems.map((p, i) => (
              <div key={i} style={s.problemCard}>
                <p style={s.problemQ}>{p.q}</p>
                <div style={s.problemDivider} />
                <p style={s.problemA}>{p.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={s.how}>
        <div style={s.sectionInner}>
          <div style={s.howGrid}>
            <div>
              <p style={s.eyebrowWhite}>How it works</p>
              <h2 style={s.howH2}>Built around the structure you already have.</h2>
              {steps.map((step, i) => (
                <div key={i} style={s.step}>
                  <div style={s.stepNum}>0{i + 1}</div>
                  <div>
                    <p style={s.stepRole}>{step.role}</p>
                    <p style={s.stepAction}>{step.action}</p>
                    <p style={s.stepOutcome}>{step.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={s.chartBox}>
              <p style={s.chartLabel}>Group 4 · Attendance</p>
              <p style={s.chartSub}>Benue Central</p>
              <AttendanceSVG />
              <div style={s.chartStats}>
                {[['12', 'Branches'], ['68%', 'Avg. attendance'], ['11/12', 'Reports filed']].map(([v, l], i) => (
                  <div key={i}>
                    <p style={s.statNum}>{v}</p>
                    <p style={s.statLabel}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={s.features}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>What&apos;s included</p>
          <h2 style={s.sectionH2}>Everything a church needs.<br />Nothing it doesn&apos;t.</h2>
          <div style={s.featuresGrid}>
            {feats.map((f, i) => (
              <div key={i} style={s.featureCard}>
                <div style={s.featureRule} />
                <p style={s.featureTitle}>{f.t}</p>
                <p style={s.featureBody}>{f.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <div style={s.sectionInner}>
          <div style={s.ctaBox}>
            <div>
              <h2 style={s.ctaH2}>Start with your group.<br /><span style={{ color: 'rgba(255,255,255,.28)' }}>Scale to your state.</span></h2>
              <p style={s.ctaSub}>Piloting with select DLBC groups in Benue State. Reach out to arrange a demonstration with your branch secretaries.</p>
            </div>
            <a href={DEMO_HREF} style={{ ...s.ctaPrimary, whiteSpace: 'nowrap' }}>Request a Demo</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div>
          <div style={s.footerLogo}>Flock</div>
          <div style={s.footerSub}>Church administration infrastructure</div>
        </div>
        <div style={s.footerRight}>Built by Black Sheep Co. · Makurdi, Nigeria</div>
      </footer>
    </div>
  )
}
