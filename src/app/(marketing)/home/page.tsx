'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Workflow Animation ───────────────────────────────────────────────────────
// Shows the real DLBC flow: Usher → Branch Secretary → Group Coordinator → State HQ → National HQ
function WorkflowAnimation() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const t = setInterval(() => setStep(s => (s + 1) % 5), 2200)
    return () => clearInterval(t)
  }, [visible])

  const nodes = [
    { label: 'Usher', sub: 'Counts heads', icon: '✦', color: 'rgba(255,255,255,0.12)' },
    { label: 'Branch Secretary', sub: 'Records & compiles weekly', icon: '✦', color: 'rgba(255,255,255,0.20)' },
    { label: 'Group Coordinator', sub: 'Aggregates monthly', icon: '✦', color: 'rgba(255,255,255,0.28)' },
    { label: 'State HQ · Makurdi', sub: 'Reviews all groups', icon: '✦', color: 'rgba(255,255,255,0.36)' },
    { label: 'National HQ · Lagos', sub: 'Full denomination view', icon: '✦', color: 'rgba(255,255,255,0.50)' },
  ]

  return (
    <div ref={ref} style={{ width: '100%', maxWidth: 340, margin: '0 auto' }}>
      {nodes.map((node, i) => {
        const isActive = step === i
        const isPast = step > i
        return (
          <div key={i}>
            {/* Node */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '14px 18px',
              border: `1px solid ${isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
              background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
              transition: 'all 0.4s ease',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: `${i * 120}ms`,
            }}>
              {/* Dot */}
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: isActive ? '#fff' : isPast ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)',
                flexShrink: 0,
                transition: 'all 0.4s ease',
                boxShadow: isActive ? '0 0 0 3px rgba(255,255,255,0.15)' : 'none',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontWeight: 700,
                  fontSize: 13,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
                  transition: 'color 0.4s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {node.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontSize: 11,
                  color: isActive ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)',
                  marginTop: 2,
                  transition: 'color 0.4s ease',
                }}>
                  {node.sub}
                </div>
              </div>
              {/* Active badge */}
              {isActive && (
                <div style={{
                  fontSize: 9,
                  fontFamily: 'var(--font-jakarta)',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                }}>
                  LIVE
                </div>
              )}
            </div>
            {/* Connector line */}
            {i < nodes.length - 1 && (
              <div style={{
                marginLeft: 22,
                width: 1,
                height: 20,
                background: isPast || isActive
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.06)',
                transition: 'background 0.4s ease',
              }} />
            )}
          </div>
        )
      })}

      {/* Bottom label */}
      <div style={{
        marginTop: 20,
        padding: '10px 18px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        fontFamily: 'var(--font-jakarta)',
        fontSize: 10,
        color: 'rgba(255,255,255,0.18)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        Reports flow automatically · No WhatsApp needed
      </div>
    </div>
  )
}

// ─── Attendance Chart ─────────────────────────────────────────────────────────
function AttendanceChart() {
  const bars = [
    { label: 'W1', h: 52 }, { label: 'W2', h: 70 }, { label: 'W3', h: 44 },
    { label: 'W4', h: 88 }, { label: 'W5', h: 62 }, { label: 'W6', h: 96 },
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
    <svg ref={ref} viewBox="0 0 200 130" fill="none"
      style={{ width: '100%', maxWidth: 200, margin: '0 auto', display: 'block' }}>
      <line x1="0" y1={svgH} x2="200" y2={svgH} stroke="rgba(255,255,255,.08)" strokeWidth="1" />
      {bars.map((b, i) => {
        const x = startX + i * (bW + gap)
        const barH = visible ? (b.h / 96) * 82 : 0
        const y = svgH - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={bW} height={barH}
              fill={i === bars.length - 1 ? 'white' : 'rgba(255,255,255,.18)'}
              style={{ transition: `height .6s cubic-bezier(.34,1.56,.64,1) ${i * 80}ms, y .6s cubic-bezier(.34,1.56,.64,1) ${i * 80}ms` }} />
            <text x={x + bW / 2} y={svgH + 14} textAnchor="middle" fontSize="8"
              fill="rgba(255,255,255,.25)" fontFamily="var(--font-jakarta)">{b.label}</text>
          </g>
        )
      })}
      <g style={{ opacity: visible ? 1 : 0, transition: 'opacity .4s ease .8s' }}>
        <circle cx="188" cy="10" r="4" fill="white">
          <animate attributeName="opacity" values="1;0.25;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <text x="180" y="14" textAnchor="end" fontSize="7.5"
          fill="rgba(255,255,255,.4)" fontFamily="var(--font-jakarta)">LIVE</text>
      </g>
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'var(--font-jakarta, "Plus Jakarta Sans", Inter, system-ui, sans-serif)', margin: 0, padding: 0, background: '#fff', color: '#000' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 56,
      }}>
        <span style={{ fontWeight: 900, fontSize: 19, color: '#fff', letterSpacing: '-0.03em' }}>Flock</span>
        <a href="/login" style={{ fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>Sign in</a>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        background: '#000', minHeight: '100vh', paddingTop: 56,
        display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }} />

        <div style={{
          maxWidth: 1024, margin: '0 auto', padding: '56px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: 48, alignItems: 'center', width: '100%', position: 'relative',
        }}>
          {/* Left */}
          <div>
            <p style={{
              fontWeight: 600, fontSize: 10.5, color: 'rgba(255,255,255,.25)',
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28,
            }}>
              Ministry Administration
            </p>
            <h1 style={{
              fontWeight: 900,
              fontSize: 'clamp(2.4rem, 7vw, 4.6rem)',
              color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.0, marginBottom: 22,
            }}>
              Every branch.<br />
              <span style={{ color: 'rgba(255,255,255,.3)' }}>One clear<br />picture.</span>
            </h1>
            <p style={{
              fontWeight: 400, fontSize: 16, color: 'rgba(255,255,255,.36)',
              lineHeight: 1.65, maxWidth: '42ch', marginBottom: 36,
            }}>
              Real-time attendance visibility for DLBC State Overseers and Group Coordinators — from every branch, without chasing a single WhatsApp message.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="mailto:victor@asktc.live?subject=Flock Demo Request"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '13px 28px', background: '#fff', color: '#000',
                  fontWeight: 700, fontSize: 14, textDecoration: 'none',
                }}>
                Request a Demo
              </a>
              <a href="#how" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '13px 28px',
                border: '1px solid rgba(255,255,255,.15)',
                color: 'rgba(255,255,255,.5)',
                fontWeight: 600, fontSize: 14, textDecoration: 'none',
              }}>
                See how it works
              </a>
            </div>
            <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.16)', marginTop: 28, letterSpacing: '0.04em' }}>
              Piloting with Benue Central State · DLBC
            </p>
          </div>

          {/* Right — workflow animation */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WorkflowAnimation />
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto' }}>
          <p style={{
            fontWeight: 600, fontSize: 10.5, color: 'rgba(0,0,0,.25)',
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20,
          }}>The Problem</p>
          <h2 style={{
            fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            color: '#000', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 48,
          }}>
            Church leadership is flying blind<br />on branch performance.
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 1, background: 'rgba(0,0,0,.09)',
          }}>
            {[
              { q: '"Where is the report from Branch 14?"', a: "A coordinator shouldn't have to ask this. With Flock, missing reports are flagged automatically." },
              { q: '"Which groups are struggling this month?"', a: "Leadership should see this without requesting it. Flock surfaces anomalies before they become problems." },
              { q: '"What was our total attendance last quarter?"', a: "Aggregating branch sheets by hand wastes hours. Flock compiles it the moment data is submitted." },
            ].map((p, i) => (
              <div key={i} style={{ background: '#fff', padding: 32 }}>
                <p style={{ fontWeight: 700, fontSize: 14.5, color: '#000', marginBottom: 16, lineHeight: 1.4 }}>{p.q}</p>
                <div style={{ width: 24, height: 1, background: 'rgba(0,0,0,.15)', marginBottom: 14 }} />
                <p style={{ fontSize: 13.5, color: 'rgba(0,0,0,.38)', lineHeight: 1.6 }}>{p.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ background: '#000', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto' }}>
          <p style={{
            fontWeight: 600, fontSize: 10.5, color: 'rgba(255,255,255,.25)',
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20,
          }}>How it works</p>
          <h2 style={{
            fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 48,
          }}>Built around the structure<br />you already have.</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: 56, alignItems: 'start',
          }}>
            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {[
                {
                  role: 'Usher',
                  action: 'Counts men, women, and children on Monday fellowship, Thursday Bible study, and Sunday service. Hands the count to the Branch Secretary.',
                  outcome: '→ Physical count becomes digital record.',
                },
                {
                  role: 'Branch Secretary',
                  action: 'Opens Flock on their phone. Enters the count per service, adds first timers, new converts, and testimony notes. Works offline — syncs when back online.',
                  outcome: '→ Weekly records compile automatically.',
                },
                {
                  role: 'Group Coordinator',
                  action: 'Sees every branch in their group in real time. Spots which branches haven\'t filed. Monthly aggregate builds itself.',
                  outcome: '→ No calls. No WhatsApp chasing.',
                },
                {
                  role: 'State HQ · Makurdi',
                  action: 'Views aggregate for all groups under the state. Flags anomalies. Downloads formatted PDF reports for the period.',
                  outcome: '→ Monthly report is ready in one click.',
                },
                {
                  role: 'National HQ · Lagos',
                  action: 'Full denomination view. Every state, every group, every branch — one dashboard.',
                  outcome: '→ Complete accountability, zero manual aggregation.',
                },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 20 }}>
                  <div style={{
                    fontWeight: 900, fontSize: 26, color: 'rgba(255,255,255,.08)',
                    lineHeight: 1, flexShrink: 0, width: 32,
                  }}>0{i + 1}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 6 }}>{s.role}</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,.36)', lineHeight: 1.65, marginBottom: 6 }}>{s.action}</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>{s.outcome}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart box */}
            <div style={{ border: '1px solid rgba(255,255,255,.1)', padding: 28 }}>
              <p style={{
                fontWeight: 600, fontSize: 10, color: 'rgba(255,255,255,.35)',
                letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4,
              }}>Group 4 · Attendance</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.18)', marginBottom: 24 }}>Benue Central</p>
              <AttendanceChart />
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
                borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 20, marginTop: 20,
              }}>
                {[['12', 'Branches'], ['68%', 'Avg. fill rate'], ['11/12', 'Reports filed']].map(([v, l], i) => (
                  <div key={i}>
                    <p style={{ fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 4 }}>{v}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,.28)' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto' }}>
          <p style={{
            fontWeight: 600, fontSize: 10.5, color: 'rgba(0,0,0,.25)',
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20,
          }}>What&apos;s included</p>
          <h2 style={{
            fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            color: '#000', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 48,
          }}>
            Everything a church needs.<br />Nothing it doesn&apos;t.
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 1, background: 'rgba(0,0,0,.08)',
          }}>
            {[
              { t: 'Offline-first recording', b: 'Branch secretaries record attendance without internet. Syncs automatically when connectivity returns.' },
              { t: 'Automatic roll-ups', b: 'Attendance flows up the hierarchy. Group totals from branches. State totals from groups. Automatically.' },
              { t: 'PDF period reports', b: 'Formatted attendance reports by week, month, or quarter — for any branch, group, or state.' },
              { t: 'Per-service tracking', b: 'Monday fellowship, Thursday Bible study, Sunday service — each tracked separately with per-meeting trends.' },
              { t: 'Role-based access', b: 'Branch secretaries see their branch. Coordinators see their group. Overseers see everything below them.' },
              { t: 'Announcement board', b: "Leadership communicates directives down the hierarchy. Each role sees what's relevant to their level." },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', padding: 32 }}>
                <div style={{ width: 24, height: 2, background: '#000', marginBottom: 20 }} />
                <p style={{ fontWeight: 700, fontSize: 14.5, color: '#000', marginBottom: 10 }}>{f.t}</p>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,.38)', lineHeight: 1.65 }}>{f.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#000', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto' }}>
          <div style={{
            border: '1px solid rgba(255,255,255,.1)', padding: 'clamp(32px, 6vw, 56px)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', gap: 36, flexWrap: 'wrap',
          }}>
            <div>
              <h2 style={{
                fontWeight: 900,
                fontSize: 'clamp(1.7rem, 4vw, 3rem)',
                color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 16,
              }}>
                Start with your group.<br />
                <span style={{ color: 'rgba(255,255,255,.28)' }}>Scale to your state.</span>
              </h2>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.28)', lineHeight: 1.65, maxWidth: '44ch' }}>
                Piloting with select DLBC groups in Benue State. Reach out to arrange a demonstration with your branch secretaries.
              </p>
            </div>
            <a href="mailto:victor@asktc.live?subject=Flock Demo Request&body=Hi Victor, I'd like to learn more about Flock for our church."
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '14px 32px', background: '#fff', color: '#000',
                fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
              Request a Demo
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: '#000', borderTop: '1px solid rgba(255,255,255,.05)',
        padding: '32px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17, color: '#fff' }}>Flock</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.18)', marginTop: 4 }}>Church administration infrastructure</div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.14)' }}>Built by Black Sheep Co. · Makurdi, Nigeria</div>
      </footer>
    </div>
  )
}
