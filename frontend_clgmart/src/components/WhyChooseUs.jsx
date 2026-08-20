import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    title: 'Find Campus Deals Instantly',
    desc: 'Browse second-hand items listed by students at your college. No shipping delays — meet sellers locally and inspect items before buying.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    title: 'Safe & Secure Platform',
    desc: 'Communicate through in-app messaging, view seller profiles, and transact with confidence on a trusted campus marketplace.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    iconBg: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    title: '100% Free to Use',
    desc: 'Post unlimited listings for free. No listing fees, no commissions, no hidden charges. Keep 100% of your sale price.',
  },
]

export default function WhyChooseUs() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const t = getThemeStyles(theme)
  const isDark = theme === 'dark'

  // ── colours ──────────────────────────────────────────
  const cardBg    = isDark ? 'rgba(30,34,53,0.85)' : 'rgba(255,255,255,0.88)'
  const cardBorder= isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'
  const titleClr  = isDark ? '#e8eaf0' : '#1a2340'
  const descClr   = isDark ? '#8892a4' : '#5a6a85'
  const headingClr= t.accent

  // CTA banner gradient — uses site accent teal into indigo/purple
  const ctaBg = isDark
    ? 'linear-gradient(135deg, #0f2033 0%, #1a1060 100%)'
    : 'linear-gradient(135deg, #23e5db 0%, #6366f1 60%, #8b5cf6 100%)'

  // CTA button — teal pill matching navbar + SELL button
  const ctaBtnBg = '#23e5db'
  const ctaBtnColor = '#002f34'

  return (
    <>
      {/* ── WHY CHOOSE US ──────────────────────────────── */}
      <section style={{ padding: '60px 24px', background: 'transparent' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800,
              color: titleClr, margin: '0 0 10px', letterSpacing: '-0.3px',
            }}>
              Why Choose{' '}
              <span style={{ color: titleClr }}>College</span><span style={{ color: headingClr }}>Mart</span><span style={{ color: titleClr }}>?</span>
            </h2>
            <p style={{ fontSize: '15px', color: descClr, maxWidth: '520px', margin: '0 auto' }}>
              The smartest way to buy and sell used items within your campus community — trusted by students across India.
            </p>
          </div>

          {/* Feature cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: '20px',
                  padding: '36px 28px',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = isDark
                    ? '0 14px 36px rgba(35,229,219,0.14)'
                    : '0 14px 36px rgba(14,165,233,0.14)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: f.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
                }}>
                  {f.icon}
                </div>

                <h3 style={{
                  fontSize: '16px', fontWeight: 700,
                  color: titleClr, margin: '0 0 12px',
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontSize: '13.5px', color: descClr,
                  lineHeight: 1.75, margin: 0,
                }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELL CTA BANNER ──────────────────────────────── */}
      <section style={{ padding: '0 24px 64px', background: 'transparent' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            background: ctaBg,
            borderRadius: '20px',
            padding: '44px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
            boxShadow: isDark
              ? '0 16px 48px rgba(99,102,241,0.25)'
              : '0 16px 48px rgba(35,229,219,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* decorative circles */}
            <div style={{
              position: 'absolute', top: '-40px', right: '120px',
              width: '160px', height: '160px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-30px', right: '-20px',
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
            }} />

            {/* Text */}
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <h2 style={{
                fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800,
                color: '#ffffff', margin: '0 0 10px', letterSpacing: '-0.2px',
              }}>
                Ready to sell something?
              </h2>
              <p style={{
                fontSize: '14px', color: 'rgba(255,255,255,0.82)',
                margin: 0, lineHeight: 1.7, maxWidth: '420px',
              }}>
                Turn your unused campus items into cash. Posting is free, takes just minutes, and reaches thousands of students at your college.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/sell')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 32px',
                background: ctaBtnBg,
                color: ctaBtnColor,
                border: 'none', borderRadius: '30px',
                fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: '0 6px 20px rgba(35,229,219,0.45)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(35,229,219,0.6)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(35,229,219,0.45)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ctaBtnColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              Start Selling Now
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
