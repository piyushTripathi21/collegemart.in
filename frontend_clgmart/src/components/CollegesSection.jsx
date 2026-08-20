import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const popularColleges = [
  { label: 'IIT Delhi', short: 'IIT Delhi', emoji: '🎓' },
  { label: 'VIT Vellore', short: 'VIT Vellore', emoji: '🏆' },
  { label: 'BITS Pilani', short: 'BITS Pilani', emoji: '⭐' },
  { label: 'NIT Trichy', short: 'NIT Trichy', emoji: '🎯' }
]

const trendingColleges = [
  { label: 'Manipal University', short: 'MAHE Manipal', emoji: '🌟' },
  { label: 'Symbiosis Pune', short: 'SIU Pune', emoji: '💫' },
  { label: 'DU North Campus', short: 'DU New Delhi', emoji: '📚' },
  { label: 'Amity University', short: 'Amity Noida', emoji: '🏅' }
]

export default function CollegesSection() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Theme colors
  const bgGradient = isDark
    ? 'linear-gradient(135deg, #0f1117 0%, #1a1060 100%)'
    : 'linear-gradient(135deg, #f8f9fa 0%, #f0f4ff 100%)'

  const sectionBg = isDark ? '#0f1117' : '#ffffff'
  const titleColor = isDark ? '#e8eaf0' : '#002f34'
  const subtitleColor = isDark ? '#8892a4' : '#666666'
  const cardBg = isDark ? '#1e2130' : '#ffffff'
  const cardBorder = isDark ? '#2e3347' : '#e8e8e8'
  const cardHoverBg = isDark ? '#252d3d' : '#f5f5f5'

  const handleCollegeClick = (college) => {
    navigate(`/college/${encodeURIComponent(college.short)}`)
  }

  const CollegeCard = ({ college, isPopular }) => (
    <div
      onClick={() => handleCollegeClick(college)}
      style={{
        padding: '20px',
        backgroundColor: cardBg,
        border: `1.5px solid ${cardBorder}`,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(35, 229, 219, 0.2)'
        e.currentTarget.style.borderColor = 'var(--accent)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = cardBorder
      }}
    >
      {/* Decorative badge */}
      {isPopular && (
        <div
          style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            width: '60px',
            height: '60px',
            background: 'var(--accent)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            opacity: 0.15
          }}
        >
          🔥
        </div>
      )}

      <div style={{ fontSize: '36px', marginBottom: '12px' }}>
        {college.emoji}
      </div>

      <h3
        style={{
          fontSize: '16px',
          fontWeight: 700,
          color: titleColor,
          margin: '0 0 8px',
          lineHeight: '1.4'
        }}
      >
        {college.label}
      </h3>

      <p
        style={{
          fontSize: '12px',
          color: subtitleColor,
          margin: 0,
          marginBottom: '12px'
        }}
      >
        Browse & Buy
      </p>

      <div
        style={{
          display: 'inline-block',
          padding: '6px 16px',
          backgroundColor: 'var(--accent)',
          color: '#002f34',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }}
      >
        View Products →
      </div>
    </div>
  )

  return (
    <section style={{ background: sectionBg, padding: '60px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Popular Colleges */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: titleColor,
                margin: '0 0 12px',
                letterSpacing: '-0.5px'
              }}
            >
              Popular Colleges
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: subtitleColor,
                margin: 0,
                maxWidth: '400px',
                margin: '0 auto'
              }}
            >
              Browse products from top colleges across India
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}
          >
            {popularColleges.map(college => (
              <CollegeCard
                key={college.short}
                college={college}
                isPopular={true}
              />
            ))}
          </div>
        </div>

        {/* Trending Colleges */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: titleColor,
                margin: '0 0 12px',
                letterSpacing: '-0.5px'
              }}
            >
              Trending Colleges
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: subtitleColor,
                margin: 0,
                maxWidth: '400px',
                margin: '0 auto'
              }}
            >
              Check out the hottest deals from trending campuses
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}
          >
            {trendingColleges.map(college => (
              <CollegeCard
                key={college.short}
                college={college}
                isPopular={false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
