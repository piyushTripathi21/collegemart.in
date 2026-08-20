import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

const featureCards = [
  { title: '30M+', subtitle: 'Monthly Active Users' },
  { title: '12+', subtitle: 'Product Categories' },
  { title: '#1', subtitle: "India's Leading Student Platform" },
  { title: 'Pan India', subtitle: 'From Metros to Small Towns' }
]

const values = [
  'Be Open', 'Be Proactive', 'Build on Each Other',
  'Listen and Learn', 'Take Ownership', 'Work Back From Customers'
]

const testimonials = [
  { quote: 'CollegeMart has worked very well for me. I am very happy with your services and would like to give this experience a high rating.', name: 'Mohd Sakib', date: '10th Nov' },
  { quote: "A very user-friendly platform. It's easy to post listings, connect with genuine buyers and sellers, and complete deals quickly.", name: 'Divyansh Champawat', date: '20th Oct' },
  { quote: 'This platform helps find nearby buyers and sellers. It is very helpful for students looking to save money on campus essentials.', name: 'Rajvir Jhala', date: '7th Oct' }
]

const teamMembers = [
  {
    name: 'Pankaj Singh',
    role: 'Co-Founder',
    image: '/uploads/pankaj.png'
  },
  {
    name: 'Piyush Tripathi',
    role: 'Co-Founder',
    image: '/uploads/piyush.png'
  }
]

function TeamCard({ member, t, theme }) {
  const [imageError, setImageError] = useState(false)
  
  const nameParts = member.name.split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ')
  const firstLetter = firstName.charAt(0)
  const restOfFirstName = firstName.slice(1)

  const placeholderBg = theme === 'dark'
    ? 'linear-gradient(135deg, #252836 0%, #1e2130 100%)'
    : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
  
  const placeholderColor = theme === 'dark' ? '#8892a4' : '#6b7280'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '240px' }}>
      <div style={{
        width: '100%',
        height: '240px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: placeholderBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        position: 'relative',
        border: `1px solid ${t.border}`
      }}>
        {!imageError ? (
          <img 
            src={member.image} 
            alt={member.name} 
            onError={() => setImageError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: placeholderColor }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span style={{ fontSize: '10px', marginTop: '8px', fontWeight: 600, letterSpacing: '0.05em', opacity: 0.8 }}>
              IMAGE PLACEHOLDER
            </span>
          </div>
        )}
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: t.textPrimary, margin: '0 0 6px 0', lineHeight: 1.2 }}>
        <span style={{ color: t.accent }}>{firstLetter}</span>{restOfFirstName} {lastName}
      </h3>
      <p style={{ fontSize: '14px', color: t.textMuted, margin: 0, fontWeight: 500 }}>
        {member.role}
      </p>
    </div>
  )
}

export default function AboutPage({ user, onOpenLogin, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, selectedCollege, onCollegeChange, onSearchSubmit }) {
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(false)
  const { theme } = useTheme()
  const t = getThemeStyles(theme)

  const isDark = theme === 'dark'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'inherit'
    }}>
      {}
      <div style={{
        position: 'absolute', top: '100px', right: '-150px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: isDark ? 'rgba(35,229,219,0.03)' : 'rgba(14,165,233,0.05)',
        pointerEvents: 'none',
        filter: 'blur(100px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: '1200px', left: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
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
        <Navbar user={user} onOpenLogin={onOpenLogin} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCollege={selectedCollege} onCollegeChange={onCollegeChange} onSearchSubmit={onSearchSubmit} />
        <main>

          {}
          <section style={{ backgroundColor: 'transparent', borderBottom: `1px solid ${t.border}`, padding: '64px 24px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.tagText, display: 'block', marginBottom: '16px' }}>
                  About CollegeMart
                </span>
                <h1 style={{ fontSize: '40px', fontWeight: 700, color: t.textPrimary, lineHeight: 1.15, margin: '0 0 20px' }}>
                  India's Student Marketplace for Campus Essentials
                </h1>
                <p style={{ fontSize: '16px', color: t.textMuted, lineHeight: 1.8, margin: '0 0 32px' }}>
                  CollegeMart is the fastest growing student marketplace for buying and selling campus essentials. We help students discover great deals, connect with local buyers, and reuse resources safely within their college community.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate('/careers')} style={{ backgroundColor: t.btnPrimaryBg, color: t.btnPrimaryText, border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                    Explore Open Positions
                  </button>
                  <button onClick={() => setShowMore(prev => !prev)} style={{ backgroundColor: 'transparent', color: t.textSecondary, border: `1px solid ${t.btnOutlineBorder}`, padding: '12px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                    {showMore ? 'Show Less' : 'Learn More'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {featureCards.map(card => (
                  <div key={card.title} style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: t.textPrimary, marginBottom: '6px' }}>{card.title}</div>
                    <div style={{ fontSize: '13px', color: t.textMuted }}>{card.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {}
          {showMore && (
            <section style={{ padding: '40px 24px', backgroundColor: 'transparent', borderTop: `1px solid ${t.borderLight}` }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: t.textPrimary, marginBottom: '12px' }}>Why Choose CollegeMart?</h2>
                <p style={{ fontSize: '15px', color: t.textMuted, lineHeight: 1.75, marginBottom: '28px' }}>
                  CollegeMart connects students across campuses with a trusted marketplace for gently used essentials.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {[
                    { title: 'Campus-first convenience', desc: 'Search, list, and connect with fellow students in a platform built for college life.' },
                    { title: 'Safe local exchanges', desc: 'We encourage transparent buying and selling so students can trade with confidence.' },
                    { title: 'Sustainable reuse', desc: 'Our marketplace reduces waste by giving products a second life on campus.' }
                  ].map(item => (
                    <div key={item.title} style={{ padding: '20px', border: `1px solid ${t.border}`, borderRadius: '8px', backgroundColor: t.cardBgAlt }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: t.textPrimary, margin: '0 0 8px' }}>{item.title}</h3>
                      <p style={{ fontSize: '14px', color: t.textMuted, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {}
          <section style={{ padding: '64px 24px', borderTop: `1px solid ${t.borderLight}`, backgroundColor: 'transparent' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: t.textPrimary, marginBottom: '12px' }}>Our Core Values</h2>
                <p style={{ fontSize: '15px', color: t.textMuted, lineHeight: 1.75, marginBottom: '32px' }}>
                  Our values drive our commitment to creating a reliable platform for buying and selling goods. We build trust by being open, proactive, and customer-focused.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {values.map(value => (
                    <div key={value} style={{ padding: '18px', border: `1px solid ${t.border}`, borderRadius: '8px', backgroundColor: t.cardBgAlt }}>
                      <div style={{ fontSize: '13px', color: t.accent, fontWeight: 700, marginBottom: '6px' }}>✓</div>
                      <div style={{ fontSize: '14px', color: t.textPrimary, fontWeight: 600 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: t.textPrimary, marginBottom: '20px' }}>Platform Overview</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {featureCards.map(card => (
                    <div key={card.title} style={{ padding: '16px', border: `1px solid ${t.border}`, borderRadius: '6px', backgroundColor: t.cardBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '14px', color: t.textMuted }}>{card.subtitle}</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: t.textPrimary }}>{card.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {}
          <section style={{ padding: '64px 24px', backgroundColor: 'transparent', borderTop: `1px solid ${t.borderLight}` }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: t.textPrimary, marginBottom: '12px' }}>Life at CollegeMart</h2>
                <p style={{ fontSize: '15px', color: t.textMuted, lineHeight: 1.75, marginBottom: '28px' }}>
                  We foster a collaborative, inclusive culture where innovation thrives and every voice matters.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[{ title: 'Collaboration', desc: 'Teams across departments work closely to deliver real value to students.' }, { title: 'Customer Focus', desc: 'Every product decision is inspired by the needs of our student community.' }].map(item => (
                    <div key={item.title} style={{ padding: '20px', border: `1px solid ${t.border}`, borderRadius: '8px', backgroundColor: t.cardBg }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: t.textPrimary, margin: '0 0 8px' }}>{item.title}</h3>
                      <p style={{ fontSize: '14px', color: t.textMuted, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${t.border}`, minHeight: '320px', backgroundColor: t.cardBgAlt }}>
                <img src="/static-assets/h4.png" alt="Life at CollegeMart" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </div>
          </section>

          {}
          <section style={{ padding: '64px 24px', borderTop: `1px solid ${t.borderLight}`, backgroundColor: 'transparent' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 40px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: t.textPrimary, marginBottom: '12px' }}>What Our Users Say</h2>
                <p style={{ fontSize: '15px', color: t.textMuted, lineHeight: 1.75 }}>Students trust CollegeMart for safe, convenient buying and selling on campus.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {testimonials.map(t2 => (
                  <div key={t2.name} style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '24px' }}>
                    <div style={{ color: t.accent, fontSize: '14px', marginBottom: '14px' }}>★★★★★</div>
                    <p style={{ fontSize: '15px', color: t.textMuted, lineHeight: 1.8, marginBottom: '20px' }}>{t2.quote}</p>
                    <div style={{ borderTop: `1px solid ${t.borderLight}`, paddingTop: '14px', fontSize: '14px', fontWeight: 700, color: t.textPrimary }}>{t2.name}</div>
                    <div style={{ fontSize: '12px', color: t.textFaint, marginTop: '2px' }}>{t2.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {}
          <section style={{ padding: '64px 24px', borderTop: `1px solid ${t.borderLight}`, backgroundColor: 'transparent' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 48px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: t.textPrimary, marginBottom: '12px', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                  Our People
                </h2>
                <p style={{ fontSize: '15px', color: t.textMuted, lineHeight: 1.75 }}>
                  We're in the business of efficiency and collaboration. Get to know the founders and team leaders making it all happen.
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '48px',
                flexWrap: 'wrap',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                {teamMembers.map(member => (
                  <TeamCard key={member.name} member={member} t={t} theme={theme} />
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}
