import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

export default function PrevTermsPage({ user, onOpenLogin }) {
  const { theme } = useTheme()
  const t = getThemeStyles(theme)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-gradient)', fontFamily: 'inherit', color: t.textPrimary, transition: 'background 0.3s ease, color 0.3s ease' }}>
      <Navbar user={user} onOpenLogin={onOpenLogin} />
      <main style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '13px', color: t.textMuted, marginBottom: '12px' }}>
              <Link to="/legal-privacy" style={{ color: t.textPrimary, textDecoration: 'none', fontWeight: 600 }}>
                Legal & Privacy information
              </Link>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: t.accentText, fontWeight: 600 }}>
                Terms of Use — Previous Version
              </span>
            </p>
            <h1 style={{ fontSize: '40px', fontWeight: '800', color: t.textPrimary, marginBottom: '8px' }}>Terms of Use</h1>
            <p style={{ fontSize: '14px', color: t.textMuted }}>Archived Version (Jan 2026 – Jun 2027)</p>
          </div>

          <div style={{ 
            backgroundColor: t.cardBg, 
            borderRadius: '16px', 
            border: `1px solid ${t.border}`, 
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)', 
            padding: '40px' 
          }}>
            {}
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.08)', 
              borderLeft: '4px solid #ef4444', 
              borderRadius: '8px', 
              padding: '16px 20px', 
              marginBottom: '32px' 
            }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Archived Version
              </h4>
              <p style={{ margin: 0, fontSize: '14px', color: t.textSecondary, lineHeight: '1.6' }}>
                This version is archived and no longer in effect. Please use the current <Link to="/terms-of-use" style={{ color: t.accentText, fontWeight: '600', textDecoration: 'none' }}>Terms of Use</Link> for the latest policies.
              </p>
            </div>

            <p style={{ fontSize: '14px', color: t.textMuted, marginBottom: '28px' }}>
              <strong>Effective:</strong> 01 January 2026 &nbsp; | &nbsp; <strong>Superseded:</strong> 12 June 2027
            </p>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                1. About CollegeMart
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '14px' }}>
                CollegeMart is an online peer-to-peer marketplace platform that enables college students in India to buy, sell, and exchange second-hand goods including books, electronics, cycles, furniture, clothing, and other items within their college community.
              </p>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                These Terms of Use govern your access to the CollegeMart website, mobile applications, and related services.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                2. Eligibility
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                To use CollegeMart, you must be at least 18 years old or be a student enrolled in a recognized Indian college or university, have a valid email address, and have the legal authority to agree to these Terms.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                3. User Accounts
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '12px' }}>
                Accounts are required to post listings or contact sellers. Provide accurate information and keep your login credentials secure.
              </p>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                Only one active account is allowed per user. Multiple accounts may result in suspension.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                4. Listing Rules
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '12px' }}>
                You may list items you legally own and that are relevant to college life. Your listing must include honest condition details and accurate pricing.
              </p>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                Prohibited items include weapons, illegal substances, counterfeit goods, stolen property, and academic fraud materials.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                5. Transactions & Safety
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '12px' }}>
                CollegeMart is a facilitator only and does not handle payment processing. Buyers and sellers are responsible for arranging payments and pickups directly.
              </p>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                We encourage safe meetups and honest communication, but we do not guarantee refunds or transaction outcomes.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                6. Prohibited Conduct
              </h2>
              <ul style={{ marginLeft: '20px', paddingLeft: 0, color: t.textSecondary, lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Posting false, misleading, or fraudulent listings</li>
                <li>Harassing or threatening other users</li>
                <li>Using fake accounts or automated tools</li>
                <li>Impersonating another person or entity</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                7. Intellectual Property
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                All CollegeMart content is Company property. User-uploaded content remains owned by the user, but CollegeMart may display it on the Platform.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                8. Content Moderation
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                CollegeMart may remove any content or account that violates these Terms and may report illegal activity to authorities.
              </p>
            </section>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                9. Disclaimers
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES. USE IT AT YOUR OWN RISK.
              </p>
            </section>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                10. Limitation of Liability
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                CollegeMart is not liable for indirect or consequential damages arising from user transactions.
              </p>
            </section>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                11. Governing Law & Disputes
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                These Terms were governed by the laws of India and disputes were subject to courts in Rewa, Madhya Pradesh, India.
              </p>
            </section>

            <section style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                12. Changes to Terms
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}>
                CollegeMart could update these Terms at any time. Continued use of the Platform meant acceptance of changes.
              </p>
            </section>

            <section style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                13. Contact Us
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '8px' }}>
                For questions about these Terms:
              </p>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '4px' }}><strong>Email:</strong> legal@collegemart.in</p>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, margin: 0 }}><strong>Address:</strong> CollegeMart, Rewa (Madhya Pradesh), India</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
