import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

const steps = [
  {
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
    title: 'Post Your Free Listing',
    desc: 'Add photos and details of your used item — publish in seconds, no fees ever.',
  },
  {
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Reach Campus Buyers',
    desc: 'Your listing gets seen by students from your college who are looking to buy nearby.',
  },
  {
    icon: (color) => (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: 'Chat & Close the Deal',
    desc: 'Connect with buyers through in-app messaging, negotiate, and sell your items quickly.',
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const t = getThemeStyles(theme)

  const isDark = theme === 'dark'

  // Background that contrasts with both the categories section and fresh recommendations
  const sectionBg = 'transparent'

  const iconBg = isDark
    ? `rgba(35,229,219,0.12)`
    : theme === 'ocean'
    ? 'rgba(14,165,233,0.12)'
    : theme === 'sunset'
    ? 'rgba(249,115,22,0.12)'
    : 'rgba(35,229,219,0.12)'

  const iconBorder = isDark
    ? 'rgba(35,229,219,0.25)'
    : theme === 'ocean'
    ? 'rgba(14,165,233,0.25)'
    : theme === 'sunset'
    ? 'rgba(249,115,22,0.25)'
    : 'rgba(35,229,219,0.25)'

  const accentColor = t.accent

  const btnBg = isDark
    ? 'linear-gradient(135deg, #23e5db 0%, #0ea5e9 100%)'
    : theme === 'ocean'
    ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
    : theme === 'sunset'
    ? 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)'
    : 'linear-gradient(135deg, #23e5db 0%, #0ea5e9 100%)'

  const btnTextColor = isDark ? '#0d1117' : '#ffffff'

  const cardBg = isDark ? 'rgba(30,34,53,0.7)' : 'rgba(255,255,255,0.8)'
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const titleColor = t.textPrimary
  const descColor = isDark ? '#8892a4' : '#5a6a85'
  const headingColor = isDark ? '#e8eaf0' : '#111111'

  return (
    <section style={{
      background: sectionBg,
      padding: '56px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* subtle decorative blobs */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: isDark ? 'rgba(35,229,219,0.04)' : 'rgba(14,165,233,0.06)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: '220px', height: '220px', borderRadius: '50%',
        background: isDark ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.06)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        {/* Heading */}
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 800,
          color: headingColor,
          margin: '0 0 8px',
          letterSpacing: '-0.3px',
        }}>
          How It Works
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: descColor,
          margin: '0 0 44px',
        }}>
          Sell or buy anything on your campus in 3 simple steps
        </p>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: '16px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '16px',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = isDark
                  ? '0 12px 32px rgba(35,229,219,0.15)'
                  : '0 12px 32px rgba(14,165,233,0.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Step number badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                {/* Icon box */}
                <div style={{
                  width: '64px', height: '64px', borderRadius: '14px', flexShrink: 0,
                  background: iconBg, border: `1.5px solid ${iconBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {step.icon(accentColor)}
                </div>
                {/* Step label */}
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
                  color: accentColor,
                  background: iconBg, border: `1px solid ${iconBorder}`,
                  borderRadius: '20px', padding: '3px 10px',
                }}>
                  STEP {i + 1}
                </span>
              </div>

              <div>
                <h3 style={{
                  fontSize: '16px', fontWeight: 700,
                  color: titleColor, margin: '0 0 8px',
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '13.5px', color: descColor,
                  margin: 0, lineHeight: 1.7,
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/sell')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 36px',
              background: btnBg,
              color: btnTextColor,
              border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: 700,
              cursor: 'pointer',
              boxShadow: isDark
                ? '0 6px 20px rgba(35,229,219,0.3)'
                : '0 6px 20px rgba(14,165,233,0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = isDark
                ? '0 10px 28px rgba(35,229,219,0.45)'
                : '0 10px 28px rgba(14,165,233,0.45)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = isDark
                ? '0 6px 20px rgba(35,229,219,0.3)'
                : '0 6px 20px rgba(14,165,233,0.3)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={btnTextColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Post Your Free Listing
          </button>
        </div>
      </div>
    </section>
  )
}
