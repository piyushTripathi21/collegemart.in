import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

const teams = ['Product & Design', 'Engineering', 'Growth & Marketing', 'Operations', 'Customer Success']

const whyCards = [
  { title: 'Impact Millions of Students', desc: 'Your work will reach a fast-growing campus audience and simplify buying and selling across colleges.' },
  { title: 'Learn Quickly', desc: 'Work in a startup mindset with cross-functional teams, rapid product cycles, and strong mentorship.' },
  { title: 'Build with Purpose', desc: 'Every feature you ship helps students save money and find what they need within their campus community.' }
]

const s = {
  page: { minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'inherit' },
  header: { backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' },
  headerInner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' },
  nav: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' },
  navLink: { textDecoration: 'none', color: '#6b7280', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: '6px', border: '1px solid transparent', transition: 'all 0.18s ease', display: 'inline-block' },
  navLinkHover: { color: '#111827', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' },
  headerBtns: { display: 'flex', gap: '10px', alignItems: 'center' },
  btnOutline: { backgroundColor: 'transparent', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 },
  btnSolid: { backgroundColor: '#111827', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 },
  hero: { backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '72px 24px', textAlign: 'center' },
  heroTag: { display: 'inline-block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '16px' },
  heroH1: { fontSize: '40px', fontWeight: 700, color: '#111827', lineHeight: 1.15, margin: '0 auto 20px', maxWidth: '700px' },
  heroP: { fontSize: '16px', color: '#6b7280', lineHeight: 1.8, maxWidth: '620px', margin: '0 auto' },
  section: { padding: '64px 24px', borderTop: '1px solid #f3f4f6' },
  sectionInner: { maxWidth: '1100px', margin: '0 auto' },
  sectionH2: { fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '12px' },
  sectionP: { fontSize: '15px', color: '#6b7280', lineHeight: 1.75, marginBottom: '32px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' },
  teamCard: { padding: '22px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fafafa' },
  teamTitle: { fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' },
  teamDesc: { fontSize: '14px', color: '#6b7280', lineHeight: 1.65, margin: 0 },
  whyPanel: { backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '28px' },
  whyH3: { fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '20px' },
  whyCard: { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '18px', marginBottom: '12px' },
  whyCardTitle: { fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '8px' },
  whyCardDesc: { fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: 0 },
  videoWrap: { position: 'relative', paddingTop: '56.25%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', backgroundColor: '#f3f4f6' },
  videoEl: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }
}

export default function CareersPage({ user, onOpenLogin }) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const t = getThemeStyles(theme)
  const [hoveredNav, setHoveredNav] = useState(null)
  
  const isDark = theme === 'dark'

  const navProps = (id) => ({
    style: { ...s.navLink, ...(hoveredNav === id ? s.navLinkHover : {}) },
    onMouseEnter: () => setHoveredNav(id),
    onMouseLeave: () => setHoveredNav(null)
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'inherit',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      {}
      <div style={{
        position: 'absolute', top: '100px', right: '-150px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: isDark ? 'rgba(35,229,219,0.03)' : 'rgba(14,165,233,0.05)',
        pointerEvents: 'none',
        filter: 'blur(100px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: '1200px', left: '-200px',
        width: '700px', height: '700px', borderRadius: '50%',
        background: isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.05)',
        pointerEvents: 'none',
        filter: 'blur(120px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: '200px', left: '-150px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.04)',
        pointerEvents: 'none',
        filter: 'blur(90px)',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {}
        <header style={{ ...s.header, backgroundColor: t.headerBg, borderBottomColor: t.border }}>
          <div style={s.headerInner}>
            <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', marginRight: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src="/collegemart_logo.png"
                alt="CollegeMart Logo"
                className="navbar-logo-img"
                style={{ height: '32px', width: '32px', objectFit: 'contain' }}
              />
              <span>College<span className="accent text-primary-teal">Mart</span></span>
            </Link>
            <nav style={s.nav}>
              <Link to="/" {...navProps('home')}>Home</Link>
              <Link to="/about" {...navProps('about')}>About</Link>
              <a href="#working-at-collegemart" {...navProps('culture')}>Culture</a>
              <a href="#join-us" {...navProps('roles')}>Open Roles</a>

            </nav>
            <div style={s.headerBtns}>
              <button type="button" onClick={() => user ? navigate('/sell') : onOpenLogin?.()} className="sell-btn">
                + SELL
              </button>
            </div>
          </div>
        </header>

        <main>
          {}
          <section style={{ ...s.hero, backgroundColor: 'transparent', borderBottomColor: t.border }}>
            <span style={{ ...s.heroTag, color: t.tagText }}>Careers at CollegeMart</span>
            <h1 style={{ ...s.heroH1, color: t.textPrimary }}>Shape Your Future at CollegeMart</h1>
            <p style={{ ...s.heroP, color: t.textMuted }}>
              Join India's fastest-growing student marketplace and help millions of learners buy, sell, and connect on campus every day.
            </p>
          </section>

          {}
          <section id="working-at-collegemart" style={{ ...s.section, backgroundColor: 'transparent', borderTopColor: t.borderLight }}>
            <div style={s.sectionInner}>
              <h2 style={{ ...s.sectionH2, textAlign: 'center', color: t.textPrimary }}>Working at CollegeMart</h2>
              <p style={{ ...s.sectionP, textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px', color: t.textMuted }}>
                CollegeMart is a leading student classifieds platform, helping college communities discover great deals across books, electronics, furniture and campus essentials.
              </p>
              <div style={s.videoWrap}>
                <video
                  src="/static-assets/ultra-realistic-premium-cinematic-8-second-website.mp4"
                  muted loop playsInline
                  style={s.videoEl}
                  onMouseEnter={e => e.currentTarget.play()}
                  onMouseLeave={e => e.currentTarget.pause()}
                />
              </div>
            </div>
          </section>

          {}
          <section id="join-us" style={{ ...s.section, backgroundColor: 'transparent', borderTopColor: t.borderLight }}>
            <div style={s.sectionInner}>
              <div style={s.grid2}>
                <div>
                  <h2 style={{ ...s.sectionH2, color: t.textPrimary }}>Explore Opportunities Across Teams</h2>
                  <p style={{ ...s.sectionP, color: t.textMuted }}>
                    We're building a marketplace experience tailored to students. If you care about customer trust, fast delivery, and smart product experiences, CollegeMart is the place to grow.
                  </p>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {teams.map(team => (
                      <div key={team} style={{ ...s.teamCard, backgroundColor: t.cardBgAlt, borderColor: t.border }}>
                        <div style={{ ...s.teamTitle, color: t.textPrimary }}>{team}</div>
                        <p style={{ ...s.teamDesc, color: t.textMuted }}>
                          Craft meaningful experiences for students and help build the next generation of campus commerce.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ ...s.whyPanel, backgroundColor: t.cardBgAlt, borderColor: t.border }}>
                  <h3 style={{ ...s.whyH3, color: t.textPrimary }}>Why CollegeMart?</h3>
                  {whyCards.map(card => (
                    <div key={card.title} style={{ ...s.whyCard, backgroundColor: t.cardBg, borderColor: t.border }}>
                      <div style={{ ...s.whyCardTitle, color: t.textPrimary }}>{card.title}</div>
                      <p style={{ ...s.whyCardDesc, color: t.textMuted }}>{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </div>
  )
}
