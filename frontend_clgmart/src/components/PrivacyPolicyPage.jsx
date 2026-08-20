import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
        Privacy Policy - Current [updated on 1 January 2026]
      </Link>
      <Link
        to="/privacy-policy/previous"
        style={linkStyle('previous')}
        onMouseEnter={() => setHovered('previous')}
        onMouseLeave={() => setHovered(null)}
      >
        Privacy Policy - Previous version
      </Link>
      <a
        href="#cookies"
        style={linkStyle('cookies')}
        onMouseEnter={() => setHovered('cookies')}
        onMouseLeave={() => setHovered(null)}
      >
        Policy on Cookies and Similar Technologies
      </a>
    </nav>
  )
}

export default function PrivacyPolicyPage({ user, onOpenLogin }) {
  const location = useLocation()
  const { theme } = useTheme()
  const t = getThemeStyles(theme)

  useEffect(() => {
    const scrollToHash = (hash) => {
      if (!hash) return
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        // slight delay to allow layout to settle
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
      }
    }

    scrollToHash(location.hash || window.location.hash)

    const onHashChange = () => scrollToHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [location.hash])

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
              <span style={{ color: t.accentText, fontWeight: 600 }}>Privacy Policy - Current</span>
            </p>
            <h1 style={{ fontSize: '40px', fontWeight: '800', color: t.textPrimary, marginBottom: '8px' }}>Privacy Policy</h1>
            <p style={{ fontSize: '14px', color: t.textMuted }}>Last Updated: 1 January 2026</p>
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
              <p style={{ fontSize: '15px', color: t.textSecondary, lineHeight: '1.8', marginBottom: '24px' }}>
                At <strong>CollegeMart</strong>, we believe that your personal data security and privacy are paramount. We are a community-focused peer-to-peer marketplace designed to connect students securely. Below, we explain transparently how we handle your data, keeping it simple, clear, and focused on our platform operations.
              </p>

              {/* Purple Guarantee Block */}
              <div style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.12)' : '#FAF5FF', 
                borderLeft: '4px solid #A855F7', 
                borderRadius: '8px', 
                padding: '18px 20px', 
                margin: '24px 0' 
              }}>
                <h4 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '15px', 
                  fontWeight: '700', 
                  color: theme === 'dark' ? '#D8B4FE' : '#7C3AED', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  Core Privacy Guarantee
                </h4>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  color: t.textSecondary, 
                  lineHeight: '1.6' 
                }}>
                  Absolutely all listings, chats, and user transactions on CollegeMart are stored securely. We do <strong>not sell your personal data</strong> to third parties, and your passwords are fully hashed. We keep your data safe and focused purely on connecting campus buyers and sellers.
                </p>
              </div>

              {/* Styled Sections with Emojis Removed */}
              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  1. Information We Collect
                </h3>
                
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>
                  1.1 Information You Provide
                </h4>
                <ul style={{ marginLeft: '20px', paddingLeft: 0, color: t.textSecondary, lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Full name and username:</strong> Used to set up your identity on the platform.</li>
                  <li><strong>Email address:</strong> For account verification and notifications.</li>
                  <li><strong>Mobile number:</strong> Shared only if you choose to display it on your listing.</li>
                  <li><strong>College name and city:</strong> To show localized listings to students in your area.</li>
                  <li><strong>Profile photo (optional):</strong> Customize your student profile page.</li>
                  <li><strong>Listing details:</strong> Product photos, descriptions, prices for buying and selling.</li>
                  <li><strong>In-app messages:</strong> Stored securely to facilitate your chats with buyers/sellers.</li>
                </ul>

                <h4 style={{ fontSize: '16px', fontWeight: '600', color: t.textPrimary, marginTop: '20px', marginBottom: '8px' }}>
                  1.2 Information Collected Automatically
                </h4>
                <ul style={{ marginLeft: '20px', paddingLeft: 0, color: t.textSecondary, lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Device details:</strong> IP address, browser type, and operating system.</li>
                  <li><strong>Usage logs:</strong> Pages visited, time spent, search queries, and interactions.</li>
                  <li><strong>Diagnostics:</strong> Crash reports and performance metrics.</li>
                </ul>

                <h4 style={{ fontSize: '16px', fontWeight: '600', color: t.textPrimary, marginTop: '20px', marginBottom: '8px' }}>
                  1.3 Information from Third Parties
                </h4>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                  If you log in via Google or other OAuth providers, we receive your basic profile info (name, email, profile picture) as permitted by your settings on that platform.
                </p>
              </section>

              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  2. How We Use Your Information
                </h3>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                  We use your data to create and manage your account, display listings, enable messaging, send transactional emails, improve features, detect fraud, and comply with legal obligations. We do <strong>NOT</strong> sell your personal data to third parties.
                </p>
              </section>

              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  3. How We Share Your Information
                </h3>
                
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>
                  3.1 With Other Users
                </h4>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', marginBottom: '12px' }}>
                  Your username, college, and listing details are visible to other users. Your mobile number is only shared if you choose to display it on your listing.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>
                  3.2 Service Providers
                </h4>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', marginBottom: '12px' }}>
                  We share data with trusted providers: cloud hosting, email delivery, analytics, and push notifications. All providers are bound by confidentiality agreements.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>
                  3.3 Legal Requirements
                </h4>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                  We may disclose information when required by law or to protect user safety.
                </p>
              </section>

              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  4. Data Storage & Security
                </h3>
                <ul style={{ marginLeft: '20px', paddingLeft: 0, color: t.textSecondary, lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Secure Servers:</strong> All user data is stored on secure servers located in India or compliant regions.</li>
                  <li><strong>Encryption:</strong> We use HTTPS/TLS protocols for all data in transit.</li>
                  <li><strong>Password Hashing:</strong> Passwords are cryptographically hashed and never stored in plain text.</li>
                  <li><strong>Audits:</strong> We perform regular security audits to ensure protection.</li>
                </ul>
              </section>

              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  5. Data Retention
                </h3>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                  We retain data while your account is active. Deleting your account removes listings within 30 days; chat messages may be retained for 90 days; anonymized analytics may be retained indefinitely.
                </p>
              </section>

              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  6. Your Rights
                </h3>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                  You can access, correct, delete your data, opt out of marketing, or withdraw consent where applicable. For requests, contact us at <strong>collegemart.privacy@gmail.com</strong>.
                </p>
              </section>

              <section style={{ marginTop: '36px', borderTop: `1px solid ${t.border}`, paddingTop: '28px' }} id="cookies">
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Policy on Cookies and Similar Technologies
                </h3>
                <p style={{ color: t.textMuted, fontSize: '13px', marginBottom: '20px' }}>Last Updated: 12 June 2026</p>

                <h4 style={{ fontSize: '16px', fontWeight: '600', color: t.textPrimary, marginTop: '20px', marginBottom: '8px' }}>
                  1. What Are Cookies?
                </h4>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', marginBottom: '16px' }}>
                  Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the site.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '600', color: t.textPrimary, marginTop: '20px', marginBottom: '8px' }}>
                  2. Cookies We Use
                </h4>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', marginBottom: '12px' }}>
                  We use the following categories of cookies:
                </p>
                <div style={{ overflowX: 'auto', marginTop: '12px', marginBottom: '16px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: `1.5px solid ${t.border}`, color: t.textPrimary, fontWeight: 700 }}>Cookie Type</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: `1.5px solid ${t.border}`, color: t.textPrimary, fontWeight: 700 }}>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                        <td style={{ padding: '12px 8px', verticalAlign: 'top', color: t.textSecondary, fontWeight: 600 }}>Essential Cookies</td>
                        <td style={{ padding: '12px 8px', color: t.textSecondary, lineHeight: 1.5 }}>Keep you logged in, maintain your session, and remember your college selection.</td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                        <td style={{ padding: '12px 8px', verticalAlign: 'top', color: t.textSecondary, fontWeight: 600 }}>Functional Cookies</td>
                        <td style={{ padding: '12px 8px', color: t.textSecondary, lineHeight: 1.5 }}>Remember your preferences (language, college filter, category selection).</td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                        <td style={{ padding: '12px 8px', verticalAlign: 'top', color: t.textSecondary, fontWeight: 600 }}>Analytics Cookies</td>
                        <td style={{ padding: '12px 8px', color: t.textSecondary, lineHeight: 1.5 }}>Understand how users navigate the Platform (via Google Analytics — anonymized).</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '12px 8px', verticalAlign: 'top', color: t.textSecondary, fontWeight: 600 }}>Performance Cookies</td>
                        <td style={{ padding: '12px 8px', color: t.textSecondary, lineHeight: 1.5 }}>Monitor Platform speed and error rates.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: '12px', color: t.textSecondary, lineHeight: '1.8' }}>
                  We do <strong>NOT</strong> use advertising or tracking cookies to build profiles or serve targeted ads.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '600', color: t.textPrimary, marginTop: '20px', marginBottom: '8px' }}>
                  3. Third-Party Cookies
                </h4>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', marginBottom: '8px' }}>
                  Some cookies are set by third-party services we use:
                </p>
                <ul style={{ marginLeft: '20px', paddingLeft: 0, color: t.textSecondary, lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong>Google Analytics:</strong> For anonymous platform traffic analysis.</li>
                  <li><strong>Firebase:</strong> For pushing push notifications to users.</li>
                  <li><strong>Cloudflare:</strong> For security filtering and performance caching.</li>
                </ul>

                <h4 style={{ fontSize: '16px', fontWeight: '600', color: t.textPrimary, marginTop: '20px', marginBottom: '8px' }}>
                  4. How to Control Cookies
                </h4>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', marginBottom: '8px' }}>
                  You can configure your browser to block cookies:
                </p>
                <ul style={{ marginLeft: '20px', paddingLeft: 0, color: t.textSecondary, lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong>Chrome:</strong> Settings &rarr; Privacy and Security &rarr; Cookies</li>
                  <li><strong>Firefox:</strong> Options &rarr; Privacy & Security &rarr; Cookies</li>
                  <li><strong>Safari:</strong> Preferences &rarr; Privacy &rarr; Cookies</li>
                </ul>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', marginTop: '12px' }}>
                  <em>Note:</em> Disabling essential cookies may affect your ability to log in or use core features of CollegeMart.
                </p>
              </section>

              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  8. Children's Privacy
                </h3>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                  Not intended for users under 13. If a parent discovers a child has provided data, contact us immediately.
                </p>
              </section>

              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  9. Third-Party Links
                </h3>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                  We are not responsible for external sites; review their policies independently.
                </p>
              </section>

              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  10. Changes to this Policy
                </h3>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                  We may update this policy; we will notify users at least 7 days before changes take effect.
                </p>
              </section>

              <section style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  11. Contact Us
                </h3>
                <p style={{ color: t.textSecondary, lineHeight: '1.8', margin: 0 }}>
                  For privacy-related queries, email <strong>collegemart.privacy@gmail.com</strong> or write to <strong>CollegeMart, Rewa (Madhya Pradesh), India</strong>.
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
