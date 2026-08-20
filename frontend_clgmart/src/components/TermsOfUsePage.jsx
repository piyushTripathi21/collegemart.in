import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

export default function TermsOfUsePage({ user, onOpenLogin }) {
  const { theme } = useTheme()
  const t = getThemeStyles(theme)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-gradient)', fontFamily: 'inherit', color: t.textPrimary, transition: 'background 0.3s ease, color 0.3s ease' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        .terms-body-text {
          font-family: 'Lora', Georgia, serif;
          font-size: 15px;
          line-height: 1.9;
          letter-spacing: 0.01em;
        }
        .terms-body-text li {
          font-family: 'Lora', Georgia, serif;
          margin-bottom: 6px;
        }
      `}</style>
      <Navbar user={user} onOpenLogin={onOpenLogin} />
      <main style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Centered Header Layout matching reference UI */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ fontSize: '13px', color: t.textMuted, marginBottom: '12px' }}>
              <Link to="/legal-privacy" style={{ color: t.textPrimary, textDecoration: 'none', fontWeight: 600 }}>Legal & Privacy information</Link>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: t.accentText, fontWeight: 600 }}>Terms of Use</span>
            </p>
            <h1 style={{ fontSize: '40px', fontWeight: '800', color: t.textPrimary, marginBottom: '8px' }}>Terms of Use</h1>
            <p style={{ fontSize: '14px', color: t.textMuted }}>Last Updated: 12 June 2026</p>
          </div>

          <section className="terms-body-text" style={{ 
            backgroundColor: t.cardBg, 
            borderRadius: '16px', 
            border: `1px solid ${t.border}`, 
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)', 
            padding: '40px' 
          }}>
            
            {/* Lavender Notice Block */}
            <div style={{ 
              backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.12)' : '#FAF5FF', 
              borderLeft: '4px solid #A855F7', 
              borderRadius: '8px', 
              padding: '18px 20px', 
              marginBottom: '32px' 
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
                Core User Agreement
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: t.textSecondary, 
                lineHeight: '1.6' 
              }}>
                By accessing or using CollegeMart, you agree to be bound by these Terms of Use. We reserve the right to verify student status at any time, and account credentials must be kept strictly secure.
              </p>
            </div>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                1. About CollegeMart
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '16px' }}>
                CollegeMart is an online peer-to-peer marketplace platform that enables college students in India to buy, sell, and exchange second-hand goods including books, electronics, cycles, furniture, clothing, and other items within their college community.
              </p>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '16px' }}>
                These Terms of Use ("Terms") govern your access to and use of the CollegeMart website, mobile applications, and related services (collectively, the "Platform").
              </p>
              <p style={{ color: t.textSecondary, lineHeight: 1.8 }}>
                By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree, please do not use our Platform.
              </p>
            </article>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                2. Eligibility
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '16px' }}>
                To use CollegeMart, you must:
              </p>
              <ul style={{ marginLeft: '20px', color: t.textSecondary, lineHeight: 1.8 }}>
                <li>1. Be at least 18 years of age, OR be a student enrolled in a recognized Indian college or university</li>
                <li>2. Have a valid email address (preferably a college/institution email)</li>
                <li>3. Not be barred from using the Platform under applicable Indian law</li>
                <li>4. Have the legal authority to enter into a binding agreement</li>
              </ul>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginTop: '16px' }}>
                CollegeMart reserves the right to verify your student status at any time.
              </p>
            </article>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                3. User Accounts
              </h2>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>3.1 Registration</h3>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '16px' }}>
                You must create an account to post listings or contact sellers. You agree to provide accurate, current, and complete information during registration.
              </p>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>3.2 Account Security</h3>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '16px' }}>
                You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately at support@collegemart.in if you suspect unauthorized access to your account.
              </p>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>3.3 One Account Per User</h3>
              <p style={{ color: t.textSecondary, lineHeight: 1.8 }}>
                You may only maintain one active account. Creating multiple accounts is prohibited and may result in permanent suspension.
              </p>
            </article>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                4. Listing Rules
              </h2>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>4.1 What You Can Sell</h3>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '16px' }}>
                You may list items that are legally owned by you, relevant to college/student life, and accurately described with honest condition details.
              </p>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>4.2 What You CANNOT Sell</h3>
              <ul style={{ marginLeft: '20px', color: t.textSecondary, lineHeight: 1.8 }}>
                <li>Weapons, firearms, or ammunition</li>
                <li>Illegal drugs, narcotics, or controlled substances</li>
                <li>Alcohol or tobacco products</li>
                <li>Counterfeit or pirated goods (including photocopied textbooks for resale)</li>
                <li>Prescription medicines or medical devices</li>
                <li>Live animals</li>
                <li>Stolen or illegally obtained goods</li>
                <li>Pornographic or obscene material</li>
                <li>Exam papers, answer keys, or academic fraud materials</li>
                <li>Personal data or private information of others</li>
                <li>Any item whose sale is prohibited under Indian law</li>
              </ul>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: t.textPrimary, marginTop: '20px', marginBottom: '8px' }}>4.3 Listing Accuracy</h3>
              <p style={{ color: t.textSecondary, lineHeight: 1.8 }}>
                You must provide honest descriptions, real photos, and accurate pricing. Misleading listings will be removed and may result in account suspension.
              </p>
            </article>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                5. Transactions & Safety
              </h2>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>5.1 CollegeMart is a Facilitator Only</h3>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '16px' }}>
                CollegeMart does not directly participate in transactions between buyers and sellers. We are not a party to any sale and do not guarantee the quality, safety, legality, or availability of any listed item.
              </p>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>5.2 Meet Safely</h3>
              <ul style={{ marginLeft: '20px', color: t.textSecondary, lineHeight: 1.8 }}>
                <li>1. Meeting in public, well-lit campus areas</li>
                <li>2. Bringing a friend when meeting a stranger</li>
                <li>3. Inspecting items before paying</li>
                <li>4. Never sharing your home address or bank details in chat</li>
              </ul>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: t.textPrimary, marginTop: '20px', marginBottom: '8px' }}>5.3 Payments</h3>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '16px' }}>
                CollegeMart does not process payments. All transactions are arranged directly between buyers and sellers. Use trusted UPI apps and avoid cash where possible.
              </p>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: t.textPrimary, marginTop: '16px', marginBottom: '8px' }}>5.4 No Refund Guarantee</h3>
              <p style={{ color: t.textSecondary, lineHeight: 1.8 }}>
                As a peer-to-peer platform, CollegeMart cannot guarantee refunds. Disputes must be resolved directly between the buyer and seller.
              </p>
            </article>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                6. Prohibited Conduct
              </h2>
              <ul style={{ marginLeft: '20px', color: t.textSecondary, lineHeight: 1.8 }}>
                <li>1. Post false, misleading, or fraudulent listings</li>
                <li>2. Harass, threaten, or abuse other users</li>
                <li>3. Use the Platform for commercial bulk selling or business purposes</li>
                <li>4. Scrape, copy, or reproduce content from the Platform</li>
                <li>5. Attempt to hack, disrupt, or damage our systems</li>
                <li>6. Use bots, automated tools, or fake accounts</li>
                <li>7. Engage in spam messaging or unsolicited promotions</li>
                <li>8. Impersonate another person or entity</li>
              </ul>
            </article>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                7. Intellectual Property
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8 }}>
                All content on CollegeMart — including logos, UI design, code, and original text — is the intellectual property of CollegeMart. User-uploaded content remains owned by the user, but you grant CollegeMart a non-exclusive, royalty-free license to display and use it on the Platform for service purposes.
              </p>
            </article>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                8. Content Moderation
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8 }}>
                CollegeMart reserves the right to remove any listing, message, or account that violates these Terms, without prior notice. We may also report illegal activity to the appropriate authorities.
              </p>
            </article>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                9. Disclaimers
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8 }}>
                THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. COLLEGEMART DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES. USE THE PLATFORM AT YOUR OWN RISK.
              </p>
            </article>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                10. Limitation of Liability
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8 }}>
                To the maximum extent permitted by applicable Indian law, CollegeMart shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform.
              </p>
            </article>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                11. Governing Law & Disputes
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8 }}>
                These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Rewa, Madhya Pradesh, India.
              </p>
            </article>

            <article style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                12. Changes to Terms
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8 }}>
                CollegeMart may update these Terms at any time. Continued use of the Platform after changes constitutes your acceptance of the updated Terms.
              </p>
            </article>

            <article style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: t.textPrimary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                13. Contact Us
              </h2>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '8px' }}>
                For any questions regarding these Terms:
              </p>
              <p style={{ color: t.textSecondary, lineHeight: 1.8, marginBottom: '4px' }}><strong>Email:</strong> collegemart.dev@gmail.com</p>
              <p style={{ color: t.textSecondary, lineHeight: 1.8 }}><strong>Address:</strong> CollegeMart, Rewa (Madhya Pradesh), India</p>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
