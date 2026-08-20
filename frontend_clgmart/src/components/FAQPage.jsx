import React, { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

const faqs = [
  { question: 'What is CollegeMart?', answer: 'CollegeMart is a student marketplace for buying and selling campus essentials like books, electronics, furniture, and more within your college community.' },
  { question: 'How do I list an item for sale?', answer: 'Create an account, click on the Sell button, add photos, set a price, and provide a clear description. Your listing will then be visible to local buyers.' },
  { question: 'How can I contact a seller safely?', answer: 'Use the platform messaging system to ask questions first, meet in a public place on campus, and avoid sharing sensitive personal information.' },
  { question: 'Can I buy items from other colleges?', answer: 'Yes. CollegeMart allows you to browse listings from nearby campuses, but local pickup and safe meetups work best for most transactions.' },
  { question: 'What should I do if I have an issue with a transaction?', answer: 'Report the issue through the platform support options, and avoid completing the transaction until you have confirmed the buyer or seller is legitimate.' }
]

export default function FAQPage({ user, onOpenLogin }) {
  const [openIndex, setOpenIndex] = useState(null)
  const { theme } = useTheme()
  const t = getThemeStyles(theme)
  const isDark = theme === 'dark'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'inherit',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      {/* Subtle decorative blobs across the faq page */}
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar user={user} onOpenLogin={onOpenLogin} />

        {/* Page Header */}
        <section style={{ backgroundColor: 'transparent', borderBottom: `1px solid ${t.border}`, padding: '48px 24px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.tagText, marginBottom: '12px' }}>Support</p>
            <h1 style={{ fontSize: '36px', fontWeight: 700, color: t.textPrimary, margin: '0 0 16px', lineHeight: 1.2 }}>Frequently Asked Questions</h1>
            <p style={{ fontSize: '15px', color: t.textMuted, lineHeight: 1.75, margin: 0 }}>
              Answers to common questions about how CollegeMart works, buying and selling safely, and getting the most out of the platform.
            </p>
          </div>
        </section>

      {/* FAQ Accordion */}
      <main style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ border: `1px solid ${t.border}`, borderRadius: '8px', overflow: 'hidden' }}>
            {faqs.map((faq, i) => (
              <div key={faq.question} style={{ backgroundColor: t.cardBg, borderBottom: i < faqs.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 600, color: t.textPrimary, lineHeight: 1.4 }}>{faq.question}</span>
                  <span style={{ fontSize: '18px', color: t.textFaint, flexShrink: 0 }}>{openIndex === i ? '−' : '+'}</span>
                </button>
                {openIndex === i && (
                  <div style={{ padding: '0 24px 20px' }}>
                    <p style={{ fontSize: '15px', color: t.textMuted, lineHeight: 1.75, margin: 0 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: '40px', padding: '28px', backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ fontSize: '15px', color: t.textSecondary, fontWeight: 600, margin: '0 0 8px' }}>Still have questions?</p>
            <p style={{ fontSize: '14px', color: t.textMuted, margin: '0 0 20px' }}>Visit our Help Center for detailed guides and support resources.</p>
            <a
              href="/help-center"
              style={{ display: 'inline-block', backgroundColor: t.btnPrimaryBg, color: t.btnPrimaryText, textDecoration: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 600 }}
            >
              Go to Help Center
            </a>
          </div>
        </div>
      </main>
      <Footer />
      </div>
    </div>
  )
}
