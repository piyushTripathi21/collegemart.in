import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

export default function HelpCenter({ user, onOpenLogin }) {
  const { theme } = useTheme()
  const t = getThemeStyles(theme)
  const [activeChat, setActiveChat] = useState(null)

  const isDark = theme === 'dark'

  // ── colour helpers ──────────────────────────────────────────────────
  const pageBg = isDark ? '#0f1117' : '#f5f7fa'
  const cardBg = isDark ? '#1a1d2e' : '#ffffff'
  const border = isDark ? '#2a2d3e' : '#e8ecf0'
  const textPrimary = isDark ? '#f0f4ff' : '#1a2340'
  const textSecondary = isDark ? '#a0aec0' : '#5a6a85'
  const accent = '#23e5db'
  const accentDark = '#0ea5e9'
  const heroBg = 'transparent'
  const sectionTitle = isDark ? '#f0f4ff' : '#1a2340'

  // ── contact cards data ──────────────────────────────────────────────
  const reachUsCards = [
    {
      title: 'Connect with us',
      body: 'For support or any questions, call us on our CollegeMart student helpline. Email us at collegemart.dev@gmail.com for buy/sell queries.',
      icon: { type: 'img', src: '/static-assets/reach-phone.png' },
    },
    {
      title: 'Headquarters',
      body: 'CollegeMart Technologies Pvt. Ltd.\nSinghdwar, Haridwar\nUttarakhand – 249404, India',
      icon: { type: 'img', src: '/static-assets/reach-building.png' },
    },
    {
      title: 'Regional Office',
      body: 'CollegeMart Regional Centre\nBahadrabad,Haridwar\nUttarakhand – 249402, India',
      icon: {
        type: 'svg',
        element: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" y1="22" x2="22" y2="22" />
            <line x1="10" y1="18" x2="14" y2="18" />
            <path d="M4 14V22M20 14V22M12 2L2 9h20L12 2zM8 14v8M16 14v8" />
          </svg>
        )
      },
    },
    {
      title: 'Connect with us',
      body: 'For campus partnership or college onboarding queries, email us at collegemart.dev@gmail.com or WhatsApp our campus team.',
      icon: { type: 'img', src: '/static-assets/reach-cap.png' },
    },
    {
      title: 'Partner Office',
      body: 'CollegeMart Campus Hub\nSinghdwar,Haridwar\nUttarakhand – 249404, India',
      icon: { type: 'img', src: '/static-assets/reach-handshake.png' },
    },
    {
      title: 'Registered Office',
      body: 'CollegeMart Internet Pvt. Ltd.\nBahadrabad,Haridwar\nUttarakhand – 249402, India',
      icon: {
        type: 'svg',
        element: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            <line x1="9" y1="10" x2="15" y2="10" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        )
      },
    },
  ]

  const teamCards = [
    {
      icon: '👤',
      title: 'Student Inquiry',
      desc: 'For any student account inquiry, assistance regarding a listing, price dispute or service issues.',
      email: 'collegemart.student@gmail.com',
      color: '#6366f1',
    },
    {
      icon: '👔',
      title: 'Address to CEO',
      desc: 'For any feedback, complaints, escalations or suggestions, drop an email directly to the CEO.',
      email: 'collegemart.ceo@gmail.com',
      color: '#0ea5e9',
    },
    {
      icon: '📦',
      title: 'Bulk Selling',
      desc: 'In case you want to sell anything in bulk (more than 4 items) and want a customised quote.',
      email: 'collegemart.bulk@gmail.com',
      color: '#10b981',
    },
    {
      icon: '🤝',
      title: 'Campus Partner Program',
      desc: "If you're a student entrepreneur or campus rep and want to get affiliated to CollegeMart, drop an email.",
      email: 'collegemart.partner@gmail.com',
      color: '#f59e0b',
    },
    {
      icon: '📣',
      title: 'Business Inquiry',
      desc: 'For any Press & Media Inquiries or Partnership Opportunities including Exchange Programs & Study-Trade-In programs.',
      email: 'collegemart.business@gmail.com',
      color: '#ec4899',
    },
    {
      icon: '💼',
      title: 'Job Inquiry',
      desc: 'To explore a career opportunity with CollegeMart, please feel free to send your resume.',
      email: 'collegemart.jobs@gmail.com',
      color: '#8b5cf6',
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'inherit',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      {/* Subtle decorative blobs across the help page */}
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
        <Navbar user={user} onOpenLogin={onOpenLogin} />

        {/* ── HERO ──────────────────────────────────────────────── */}
        <div style={{ background: heroBg, padding: '60px 32px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* decorative circles */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: isDark ? 'rgba(35,229,219,0.05)' : 'rgba(14,165,233,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.07)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: textPrimary, margin: '0 0 10px', lineHeight: 1.2 }}>
              We'd love to&nbsp;
              <span style={{ color: accent }}>hear from you</span>
            </h1>
            <p style={{ fontSize: '15px', color: textSecondary, margin: '0 0 36px' }}>
              Our team is always here to help CollegeMart students and sellers
            </p>

            {/* Illustration row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
              {[
                { type: 'img', src: '/static-assets/help-laptop.png', alt: 'Laptop support' },
                { type: 'img', src: '/static-assets/help-box.png', alt: 'Box/Package support' },
                { type: 'img', src: '/static-assets/help-chat.png', alt: 'Chat support' },
                { type: 'img', src: '/static-assets/help-cap.png', alt: 'Education/College support' },
                { type: 'svg' }
              ].map((item, i) => (
                <div key={i} style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(14,165,233,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${border}`,
                  animation: `float ${1.8 + i * 0.3}s ease-in-out infinite alternate`,
                  overflow: 'hidden'
                }}>
                  {item.type === 'img' ? (
                    <img
                      src={item.src}
                      alt={item.alt}
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'contain',
                        filter: isDark ? 'invert(1) brightness(1.5)' : 'none'
                      }}
                    />
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isDark ? '#f0f4ff' : '#1a2340'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── NEED HELP? ────────────────────────────────────────── */}
        <div style={{ backgroundColor: 'transparent', padding: '40px 32px', textAlign: 'center', borderBottom: `1px solid ${border}` }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: sectionTitle, margin: '0 0 6px' }}>Need Help?</h2>
          <p style={{ fontSize: '13px', color: textSecondary, margin: '0 0 24px' }}>
            To get instant response to your query
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/919755609882?text=Hi%20CollegeMart%2C%20I%20need%20help!"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '12px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                background: '#25D366', color: '#fff', textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37,211,102,0.3)', transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,211,102,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,211,102,0.3)' }}
            >
              <svg width="20" height="20" viewBox="0 0 32 32" fill="white">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.522.68 4.883 1.857 6.917L2 30l7.294-1.832A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm7.2 19.467c-.3.843-1.757 1.61-2.41 1.71-.617.094-1.397.134-2.25-.14-.52-.166-1.186-.387-2.04-.755-3.585-1.548-5.927-5.18-6.107-5.42-.18-.24-1.47-1.957-1.47-3.74 0-1.78.933-2.657 1.263-3.02.33-.36.72-.45 1.02-.45h.66c.21 0 .495.07.756.57.3.57.93 2.29.99 2.45.06.15.1.33.01.54-.09.21-.14.33-.27.51-.14.18-.293.4-.42.54-.13.14-.267.29-.114.57.15.27.672 1.11 1.44 1.8 1.02.9 1.88 1.18 2.15 1.31.27.13.43.11.59-.07.15-.18.66-.77.84-1.04.18-.27.36-.22.6-.13.24.09 1.56.74 1.83.87.27.13.45.2.51.3.06.12.06.69-.24 1.53z"/>
              </svg>
              WhatsApp
            </a>
            <button
              onClick={() => setActiveChat(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '12px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                background: isDark ? '#1e3a5f' : '#e0f2fe', color: accentDark,
                border: `1.5px solid ${accentDark}`, cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 16px rgba(14,165,233,0.25)` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              Live Chat
            </button>
            <Link
              to="/faq"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '12px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                background: isDark ? '#1e3a5f' : '#e0f2fe', color: accentDark,
                border: `1.5px solid ${accentDark}`, textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 16px rgba(14,165,233,0.25)` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              FAQs
            </Link>
          </div>
          {activeChat && (
            <div style={{ marginTop: '16px', padding: '14px 20px', background: isDark ? '#1a2d1a' : '#f0fdf4', border: `1px solid #22c55e`, borderRadius: '8px', fontSize: '13px', color: '#16a34a', maxWidth: '400px', margin: '16px auto 0' }}>
              💬 Our support team typically replies within 5 minutes during working hours (9 AM – 9 PM IST).
            </div>
          )}
        </div>

        {/* ── REACH US ──────────────────────────────────────────── */}
        <div style={{ backgroundColor: 'transparent', padding: '50px 32px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 700, color: sectionTitle, margin: '0 0 36px' }}>
              Reach Us
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {reachUsCards.map((card, i) => (
                <div key={i} style={{
                  background: cardBg, border: `1px solid ${border}`, borderRadius: '12px',
                  padding: '24px 28px', transition: 'box-shadow 0.2s, transform 0.2s',
                  cursor: 'default'
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      fontSize: '22px'
                    }}>
                      {card.icon.type === 'img' ? (
                        <img
                          src={card.icon.src}
                          alt={card.title}
                          style={{
                            width: '24px',
                            height: '24px',
                            objectFit: 'contain',
                            filter: isDark ? 'invert(1) brightness(1.5)' : 'none'
                          }}
                        />
                      ) : (
                        <div style={{ color: isDark ? '#f0f4ff' : '#1a2340', width: '22px', height: '22px' }}>
                          {card.icon.element}
                        </div>
                      )}
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: 0 }}>{card.title}</h3>
                  </div>
                  <p style={{ fontSize: '13px', color: textSecondary, margin: 0, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── OUR TEAM ──────────────────────────────────────────── */}
        <div style={{ backgroundColor: 'transparent', borderTop: `1px solid ${border}`, padding: '50px 32px 60px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 700, color: sectionTitle, margin: '0 0 36px' }}>
              Our Team
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {teamCards.map((card, i) => (
                <div key={i} style={{
                  background: pageBg, border: `1px solid ${border}`, borderRadius: '12px',
                  padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start',
                  transition: 'box-shadow 0.2s, transform 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {/* Avatar circle */}
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                    background: `${card.color}22`, border: `2px solid ${card.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
                  }}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: '0 0 6px' }}>{card.title}</h3>
                    <p style={{ fontSize: '13px', color: textSecondary, margin: '0 0 10px', lineHeight: 1.7 }}>{card.desc}</p>
                    <a href={`mailto:${card.email}`} style={{ fontSize: '13px', color: card.color, textDecoration: 'none', fontWeight: 600 }}>
                      {card.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM NOTE ───────────────────────────────────────── */}
        <div style={{ background: isDark ? '#080b12' : '#1a2340', padding: '24px 32px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
            ⚠️ Never scan a QR code or share your OTP/password with anyone claiming to be CollegeMart staff.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            © 2024–2026 CollegeMart · All rights reserved ·{' '}
            <Link to="/privacy-policy" style={{ color: accent, textDecoration: 'none' }}>Privacy Policy</Link>
            {' '}·{' '}
            <Link to="/terms-of-use" style={{ color: accent, textDecoration: 'none' }}>Terms of Use</Link>
          </p>
        </div>

        <style>{`
          @keyframes float {
            from { transform: translateY(0px); }
            to   { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    </div>
  )
}
