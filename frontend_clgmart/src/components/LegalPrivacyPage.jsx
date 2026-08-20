import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useThemeStyles } from '../context/useThemeStyles'

const searchIcon = new URL('/search-icon.svg', import.meta.url).href

export default function LegalPrivacyPage({ user, onOpenLogin }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const t = useThemeStyles()

  const legalContent = {
    'Terms of Use': {
      title: 'Terms of Use',
      link: '/terms-of-use',
      content: 'CollegeMart is an online peer-to-peer marketplace platform that enables college students in India to buy, sell, and exchange second-hand goods including books, electronics, cycles, furniture, clothing. These Terms of Use govern your access to and use of the CollegeMart website, mobile applications. By accessing or using our Platform, you agree to be bound by these Terms. To use CollegeMart, you must be at least 18 years of age, OR be a student enrolled in a recognized Indian college. You have a valid email address. You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately at support@collegemart.in if you suspect unauthorized access. You may only maintain one active account. Creating multiple accounts is prohibited. You may list items that are legally owned by you, relevant to college/student life, and accurately described with honest condition details. You CANNOT sell weapons, firearms, ammunition, illegal drugs, narcotics, controlled substances, alcohol, tobacco, counterfeit or pirated goods, prescription medicines, live animals, stolen goods. You must provide honest descriptions, real photos, and accurate pricing. Misleading listings will be removed and may result in account suspension.'
    },
    'Privacy Policy': {
      title: 'Privacy Policy - Current [updated on 12 September 2025]',
      link: '/privacy-policy',
      content: 'CollegeMart is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal information. We collect information you provide: full name and username, email address, mobile number, college name and city, profile photo, listing details, product photos, descriptions, prices, and messages. We collect information automatically: IP address and device information, browser type and operating system, pages visited and time spent on the Platform. If you log in via Google or other OAuth providers, we receive your basic profile info. We use your data to create and manage your account, display listings, enable messaging, send transactional emails, improve features, detect fraud, and comply with legal obligations. We do NOT sell your personal data to third parties. Your username, college, and listing details are visible to other users. We share data with trusted providers: cloud hosting, email delivery, analytics, and push notifications. We may disclose information when required by law or to protect user safety. Data is stored on secure servers in India or compliant countries. We use HTTPS/TLS for data in transit. Passwords are hashed and never stored in plain text. We conduct regular security audits. We retain data while your account is active. You can access, correct, delete your data, opt out of marketing. Contact: privacy@collegemart.in'
    },
    'Cookies': {
      title: 'Policy on Cookies and Similar Technologies',
      link: '/privacy-policy#cookies',
      content: 'Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the site. Essential Cookies keep you logged in, maintain your session, remember your college selection. Functional Cookies remember your preferences like language, college filter, category selection. Analytics Cookies help us understand how users navigate the Platform via Google Analytics with anonymized data. Performance Cookies measure Platform performance. We use these cookies to provide services, improve user experience, maintain security, personalize content. You can control cookies through browser settings. However, disabling essential cookies may affect Platform functionality.'
    },
    'Terms of Use Previous Version': {
      title: 'Terms of Use Previous Version',
      link: '/terms-of-use/previous',
      content: 'This is the archived Terms of Use from 01 January 2025. For the current version, please refer to the updated Terms of Use. All terms and conditions have been updated to reflect changes in our Platform and ensure compliance with Indian law. The previous version contained similar core protections with updates for better clarity.'
    },
    'Law Enforcement Guidelines': {
      title: 'Guidelines Law Enforcement Agencies',
      link: '/help-center/law-enforcement',
      content: 'CollegeMart cooperates with law enforcement authorities in accordance with applicable laws. We provide information to government agencies and law enforcement when legally required through proper legal processes. Requests for user information must include valid legal documents such as a court order, warrant, or subpoena. We prioritize user privacy and only disclose information that is legally required. For urgent safety matters, we may provide information without legal process if necessary. Law enforcement agencies should contact legal@collegemart.in with their official requests and documentation.'
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const searchTerm = query.toLowerCase()
    const results = []

    Object.keys(legalContent).forEach(key => {
      const item = legalContent[key]
      const content = (item.content + ' ' + item.title).toLowerCase()

      if (content.includes(searchTerm)) {
        const sentences = item.content.split(/(?<=[.!?])\s+/)
        const matches = sentences.filter(sentence =>
          sentence.toLowerCase().includes(searchTerm)
        )

        if (matches.length > 0) {
          results.push({
            ...item,
            matches,
            matchCount: matches.length
          })
        }
      }
    })

    results.sort((a, b) => b.matchCount - a.matchCount)
    setSearchResults(results)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-gradient)' }}>
      <Navbar user={user} onOpenLogin={onOpenLogin} />
      <div style={{ borderBottom: `1px solid ${t.borderColor}`, padding: '20px 32px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '500', color: t.textPrimary, margin: 0 }}>Legal & Privacy information</h1>
        </div>
      </div>
      <div style={{ padding: '40px 32px', minHeight: 'calc(100vh - 300px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ fontSize: '13px', color: t.textMuted, marginBottom: '32px' }}>
            <span>India Help Center</span>
            <span> / </span>
            <span style={{ color: t.textPrimary, fontWeight: '600' }}>Legal & Privacy Information</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
            <div style={{ flex: '1 1 320px', minWidth: '280px', backgroundColor: t.cardBg, border: `1px solid ${t.borderColor}`, borderRadius: '8px', padding: '18px' }}>
              <p style={{ fontSize: '14px', color: t.textPrimary, margin: 0 }}>A detailed legal and privacy resource for CollegeMart users, covering terms, policies, and safety guidelines.</p>
            </div>
            <div style={{ flex: '1 1 320px', minWidth: '280px', backgroundColor: t.cardBg, border: `1px solid ${t.borderColor}`, borderRadius: '8px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={searchIcon} alt="Search" style={{ width: '20px', height: '20px', flexShrink: 0, filter: t.isDark ? 'invert(1)' : 'none' }} />
                <input
                  type="text"
                  placeholder="Search the Help Center"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ width: '100%', border: `1px solid ${t.borderColor}`, borderRadius: '6px', padding: '10px 12px', fontSize: '14px', outline: 'none', backgroundColor: t.cardBg, color: t.textPrimary }}
                />
              </div>
            </div>
          </div>

          {searchResults.length > 0 ? (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: t.textPrimary, marginBottom: '20px' }}>
                Search Results ({searchResults.length} found)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {searchResults.map((result, idx) => (
                  <div key={idx} style={{ backgroundColor: t.cardBg, borderRadius: '8px', border: `1px solid ${t.borderColor}`, padding: '20px', boxShadow: t.cardShadow }}>
                    <Link to={result.link} style={{ textDecoration: 'none' }}>
                      <h3 style={{ margin: '0 0 12px 0', color: t.accent, fontSize: '16px', fontWeight: '600', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
                        {result.title}
                      </h3>
                    </Link>
                    <div style={{ fontSize: '13px', color: t.textMuted, marginBottom: '12px' }}>
                      Found in {result.matchCount} location{result.matchCount > 1 ? 's' : ''}
                    </div>
                    <div style={{ fontSize: '14px', color: t.textPrimary, lineHeight: '1.6' }}>
                      {result.matches.slice(0, 2).map((match, midx) => (
                        <div key={midx} style={{ marginBottom: '8px', backgroundColor: t.isDark ? '#2e3347' : '#f0f7ff', padding: '8px 12px', borderRadius: '4px', borderLeft: `3px solid ${t.accent}` }}>
                          "{match.trim()}..."
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchQuery && (
            <div style={{ backgroundColor: t.cardBg, borderRadius: '8px', border: `1px solid ${t.borderColor}`, padding: '32px', textAlign: 'center', marginBottom: '40px' }}>
              <p style={{ fontSize: '16px', color: t.textMuted, margin: 0 }}>No results found for "{searchQuery}"</p>
            </div>
          )}

          {searchResults.length === 0 && !searchQuery && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '28px' }}>
              <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', border: `1px solid ${t.borderColor}`, padding: '32px', boxShadow: t.cardShadow, transition: 'box-shadow 0.3s ease' }}>
                <h2 style={{ margin: '0 0 20px', color: t.textPrimary, fontSize: '20px', fontWeight: '600' }}>Terms of Use</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: t.textMuted, fontSize: '15px' }}>
                  <li style={{ marginBottom: '12px' }}><Link to="/terms-of-use" style={{ color: t.accent, textDecoration: 'none', fontWeight: '500' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>Terms of Use</Link></li>
                  <li><Link to="/terms-of-use/previous" style={{ color: t.accent, textDecoration: 'none', fontWeight: '500' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>Terms of Use Previous Version</Link></li>
                </ul>
              </div>
              <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', border: `1px solid ${t.borderColor}`, padding: '32px', boxShadow: t.cardShadow, transition: 'box-shadow 0.3s ease' }}>
                <h2 style={{ margin: '0 0 20px', color: t.textPrimary, fontSize: '20px', fontWeight: '600' }}>Privacy Policy</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: t.textMuted, fontSize: '15px' }}>
                  <li style={{ marginBottom: '12px' }}><Link to="/privacy-policy" style={{ color: t.accent, textDecoration: 'none', fontWeight: '500' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>Privacy Policy - Current [updated on 12 September 2025]</Link></li>
                  <li style={{ marginBottom: '12px' }}><Link to="/privacy-policy/previous" style={{ color: t.accent, textDecoration: 'none', fontWeight: '500' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>Privacy Policy - Previous version</Link></li>
                  <li><Link to="/privacy-policy#cookies" style={{ color: t.accent, textDecoration: 'none', fontWeight: '500' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>Policy on Cookies and Similar Technologies</Link></li>
                </ul>
              </div>
              <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', border: `1px solid ${t.borderColor}`, padding: '32px', boxShadow: t.cardShadow, transition: 'box-shadow 0.3s ease' }}>
                <h2 style={{ margin: '0 0 20px', color: t.textPrimary, fontSize: '20px', fontWeight: '600' }}>Law Enforcement Authorities</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: t.textMuted, fontSize: '15px' }}>
                  <li><Link to="/help-center/law-enforcement" style={{ color: t.accent, textDecoration: 'none', fontWeight: '500' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>Guidelines Law Enforcement Agencies</Link></li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
