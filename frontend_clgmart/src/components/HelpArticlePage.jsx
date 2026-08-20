import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

export default function HelpArticlePage({ user, onOpenLogin }) {
  const { theme } = useTheme()
  const t = getThemeStyles(theme)
  const navigate = useNavigate()

  const [helpfulVote, setHelpfulVote] = useState(null) // null | 'yes' | 'no'
  const [hoveredItem, setHoveredItem] = useState(null)

  const handleVote = (vote) => {
    setHelpfulVote(vote)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-gradient)', fontFamily: 'inherit', color: t.textPrimary, transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar user={user} onOpenLogin={onOpenLogin} />

      <main style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Centered Header Layout matching reference UI */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '13px', color: t.textMuted, marginBottom: '12px' }}>
              <Link to="/help-center" style={{ color: t.textPrimary, textDecoration: 'none', fontWeight: 600 }}>India Help Center</Link>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: t.textPrimary, fontWeight: 600 }}>Legal &amp; Privacy Information</span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: t.accentText, fontWeight: 600 }}>Law Enforcement Authorities</span>
            </p>
            <h1 style={{ fontSize: '40px', fontWeight: '800', color: t.textPrimary, marginBottom: '8px' }}>Guidelines Law Enforcement</h1>
            <p style={{ fontSize: '14px', color: t.textMuted }}>Last Updated: 12 June 2026</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px' }}>

            {/* Sidebar */}
            <aside style={{ borderRadius: '12px', backgroundColor: t.cardBg, border: `1px solid ${t.border}`, padding: '24px', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)', alignSelf: 'start' }}>
              <h2 style={{ fontSize: '14px', color: t.textPrimary, marginBottom: '16px', fontWeight: 700 }}>Articles in this section</h2>

              {/* Active item — Guidelines */}
              <Link
                to="/help-center/law-enforcement"
                onMouseEnter={() => setHoveredItem('law')}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  display: 'block',
                  marginBottom: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: t.cardBgAlt,
                  color: t.accentText,
                  textDecoration: 'none',
                  fontWeight: 700,
                  border: hoveredItem === 'law' ? `1.5px solid ${t.accent}` : `1.5px solid ${t.accent}`,
                  boxShadow: hoveredItem === 'law'
                    ? '0 4px 20px rgba(35,229,219,0.25)'
                    : '0 10px 20px rgba(56, 189, 248, 0.12)',
                  transition: 'all 0.2s ease',
                  transform: hoveredItem === 'law' ? 'translateY(-1px)' : 'translateY(0)',
                  cursor: 'pointer',
                }}
              >
                Guidelines Law Enforcement Agencies
              </Link>

              {/* Privacy Policy link */}
              <Link
                to="/privacy-policy"
                onMouseEnter={() => setHoveredItem('privacy')}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  display: 'block',
                  marginBottom: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  color: hoveredItem === 'privacy' ? t.accentText : t.textPrimary,
                  textDecoration: 'none',
                  fontWeight: hoveredItem === 'privacy' ? 600 : 400,
                  border: hoveredItem === 'privacy'
                    ? `1.5px solid ${t.accent}`
                    : `1.5px solid transparent`,
                  boxShadow: hoveredItem === 'privacy'
                    ? '0 4px 20px rgba(35,229,219,0.18)'
                    : 'none',
                  transition: 'all 0.2s ease',
                  transform: hoveredItem === 'privacy' ? 'translateY(-1px)' : 'translateY(0)',
                  cursor: 'pointer',
                }}
              >
                Privacy Policy - Current
              </Link>
            </aside>

            {/* Article Content */}
            <article style={{ 
              borderRadius: '16px', 
              backgroundColor: t.cardBg, 
              border: `1px solid ${t.border}`, 
              padding: '40px', 
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)' 
            }}>
              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Format for Legal Requests/Notices
                </h2>
                <p style={{ fontSize: '15px', color: t.textSecondary, lineHeight: 1.8, marginBottom: '16px' }}>
                  We will be happy to assist you with the required information, provided the legal request submitted is valid and made in accordance with the applicable laws in India.
                </p>
                <p style={{ fontSize: '15px', color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                  Please follow the guidelines below when sending us legal requests or notices on behalf of a law enforcement authority.
                </p>
              </section>

              {/* Legal Compliance Notice Card */}
              <div style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(14, 165, 233, 0.12)' : '#F0F9FF', 
                borderLeft: '4px solid #0ea5e9', 
                borderRadius: '8px', 
                padding: '18px 20px', 
                margin: '24px 0' 
              }}>
                <h4 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '15px', 
                  fontWeight: '700', 
                  color: theme === 'dark' ? '#38BDF8' : '#0284c7', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  Legal Compliance Notice
                </h4>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  color: t.textSecondary, 
                  lineHeight: '1.6' 
                }}>
                  All data requests must comply with Section 91 of the Code of Criminal Procedure (CrPC) or other relevant Indian legal provisions. We review all incoming requests thoroughly to ensure privacy compliance before disclosing any user information.
                </p>
              </div>

              <section style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: t.textPrimary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  1. Request Requirements
                </h3>
                <ul style={{ marginLeft: '20px', paddingLeft: 0, color: t.textSecondary, lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Legible Format:</strong> Legal requests should be typed or written clearly in legible handwriting.</li>
                  <li><strong>Official Email:</strong> Sent through the official email address of the requesting law enforcement agency.</li>
                  <li><strong>Signed & Stamped:</strong> Accompanied by a scanned copy of the officially signed and stamped legal request or notice.</li>
                  <li><strong>Language:</strong> Submitted in English or Hindi languages.</li>
                </ul>
              </section>

              <section style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: t.textPrimary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  2. Required Details
                </h3>
                <ul style={{ marginLeft: '20px', paddingLeft: 0, color: t.textSecondary, lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Legal Provision:</strong> The specific applicable law and section under which the request is made.</li>
                  <li><strong>Target Identifier:</strong> Clear details to identify the account, user, phone number, or listing involved.</li>
                  <li><strong>Authority Details:</strong> Full contact information for the requesting officer or authority.</li>
                  <li><strong>Scope & Purpose:</strong> Clear explanation of the purpose and exact scope of the information sought.</li>
                </ul>
              </section>

              <section style={{ marginBottom: '28px', borderTop: `1px solid ${t.border}`, paddingTop: '24px' }}>
                <p style={{ fontSize: '15px', color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                  If you have any doubts or questions, please contact us using the official channels provided in the request section.
                </p>
              </section>

              {/* Helpful footer */}
              <footer style={{ borderTop: `1px solid ${t.border}`, paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                {helpfulVote === null ? (
                  <>
                    <div style={{ color: t.textMuted, fontSize: '14px' }}>Was this article helpful?</div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => handleVote('yes')}
                        style={{
                          padding: '10px 22px',
                          borderRadius: '10px',
                          border: `1.5px solid ${t.accent}`,
                          backgroundColor: t.cardBgAlt,
                          color: t.accentText,
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = t.accent
                          e.currentTarget.style.color = '#002f34'
                          e.currentTarget.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = t.cardBgAlt
                          e.currentTarget.style.color = t.accentText
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleVote('no')}
                        style={{
                          padding: '10px 22px',
                          borderRadius: '10px',
                          border: `1px solid ${t.border}`,
                          backgroundColor: t.cardBg,
                          color: t.textSecondary,
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#ef4444'
                          e.currentTarget.style.color = '#ef4444'
                          e.currentTarget.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = t.border
                          e.currentTarget.style.color = t.textSecondary
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        No
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    backgroundColor: helpfulVote === 'yes' ? 'rgba(35,229,219,0.1)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${helpfulVote === 'yes' ? 'rgba(35,229,219,0.3)' : 'rgba(239,68,68,0.25)'}`,
                  }}>
                    {/* Icon removed */}
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: helpfulVote === 'yes' ? t.accentText : '#ef4444' }}>
                        {helpfulVote === 'yes' ? 'Thank you for your feedback!' : 'Thanks for letting us know!'}
                      </div>
                      <div style={{ fontSize: '13px', color: t.textMuted, marginTop: '2px' }}>
                        {helpfulVote === 'yes'
                          ? 'We\'re glad this article was helpful.'
                          : 'We\'ll work on improving this article.'}
                      </div>
                    </div>
                  </div>
                )}
              </footer>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
