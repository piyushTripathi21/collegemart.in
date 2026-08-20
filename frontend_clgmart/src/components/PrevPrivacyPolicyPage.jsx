import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

function SidebarNav({ t }) {
  const [hovered, setHovered] = useState(null)

  const linkStyle = (key) => ({
    display: 'block',
    padding: '12px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: hovered === key ? 600 : 400,
    color: hovered === key ? t.accentText : t.textPrimary,
    border: hovered === key ? `1.5px solid ${t.accent}` : '1.5px solid transparent',
    backgroundColor: hovered === key ? 'rgba(35,229,219,0.08)' : 'transparent',
    boxShadow: hovered === key ? '0 2px 12px rgba(35,229,219,0.15)' : 'none',
    transform: hovered === key ? 'translateY(-1px)' : 'translateY(0)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  })

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Link
        to="/privacy-policy"
        style={linkStyle('current')}
        onMouseEnter={() => setHovered('current')}
        onMouseLeave={() => setHovered(null)}
      >
        Privacy Policy - Current
      </Link>
      <Link
        to="/privacy-policy/previous"
        style={linkStyle('previous')}
        onMouseEnter={() => setHovered('previous')}
        onMouseLeave={() => setHovered(null)}
      >
        Privacy Policy - Previous version
      </Link>
    </nav>
  )
}

export default function PrevPrivacyPolicyPage({ user, onOpenLogin }) {
  const { theme } = useTheme()
  const t = getThemeStyles(theme)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-gradient)', fontFamily: 'inherit', color: t.textPrimary, transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar user={user} onOpenLogin={onOpenLogin} />
      <main style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Centered Header Layout matching reference UI */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '13px', color: t.textMuted, marginBottom: '12px' }}>
              <Link to="/legal-privacy" style={{ color: t.textPrimary, textDecoration: 'none', fontWeight: 600 }}>Legal & Privacy information</Link>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: t.accentText, fontWeight: 600 }}>Privacy Policy - Previous version</span>
            </p>
            <h1 style={{ fontSize: '40px', fontWeight: '800', color: t.textPrimary, marginBottom: '8px' }}>Privacy Policy</h1>
            <p style={{ fontSize: '14px', color: t.textMuted }}>Archived Version (Jan 2026 – Sep 2027)</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px' }}>
            <aside style={{ position: 'sticky', top: '80px' }}>
              <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
                <h3 style={{ fontSize: '14px', color: t.textPrimary, marginBottom: '12px' }}>Articles in this section</h3>
                <SidebarNav t={t} />
              </div>
            </aside>

            <article style={{ 
              backgroundColor: t.cardBg, 
              borderRadius: '16px', 
              padding: '40px', 
              border: `1px solid ${t.border}`, 
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)' 
            }}>
              {/* Archived Alert Block */}
              <div style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.08)', 
                borderLeft: '4px solid #ef4444', 
                borderRadius: '8px', 
                padding: '16px 20px', 
                marginBottom: '24px' 
              }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Archived Version
                </h4>
                <p style={{ margin: 0, fontSize: '14px', color: t.textSecondary, lineHeight: '1.6' }}>
                  This is an archived version kept for reference only. Please refer to our current Privacy Policy at <Link to="/privacy-policy" style={{ color: t.accentText, fontWeight: '600', textDecoration: 'none' }}>collegemart.in/privacy</Link>.
                </p>
              </div>

              <p style={{ fontSize: '15px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '24px' }}>
                This archived policy reflects the earlier, simpler data practices used by CollegeMart before 12 September 2025. It does not include OAuth/Google login, Firebase Cloud Messaging, or Grievance Officer contact details.
              </p>

              {/* Styled Sections with Emojis Removed */}
              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Key Differences from Current Policy
                </h3>
                <ul style={{ marginLeft: '20px', paddingLeft: 0, color: t.textSecondary, lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>No OAuth/Google login integration described.</li>
                  <li>No Firebase Cloud Messaging / push notification handling.</li>
                  <li>No Grievance Officer contact details.</li>
                </ul>
              </section>

              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Structure
                </h3>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                  The archived policy follows the same structure as the current policy (information collected, use of data, sharing, security, retention, rights, cookies, children, third-party links, changes, contact), but with fewer integrations and contact specifics.
                </p>
              </section>

              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Contact
                </h3>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                  For current privacy details and official contact, see the current policy at collegemart.in/privacy or email <strong>collegemart.privacy@gmail.com</strong>
                </p>
              </section>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
