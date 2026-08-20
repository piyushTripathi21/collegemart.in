import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

const featuredPosts = [
  { id: '1', title: 'Complete Guide to Buying Used Engineering Books: Save Up to 70% This Semester', date: 'March 17, 2026', image: '/static-assets/h1.png', summary: 'Discover how to find affordable used engineering textbooks on CollegeMart. Learn tips for identifying good condition books and getting the best deals from fellow students.' },
  { id: '2', title: 'Best Budget Laptops for Engineering Students in 2026 Under ₹50,000', date: 'March 17, 2026', image: '/static-assets/h2.png', summary: 'Find the perfect laptop for your engineering coursework without breaking the bank. Compare specs, performance, and value for money on CollegeMart electronics.' }
]

const articleCards = [
  { id: '3', title: 'Hostel Room Essentials Checklist: Everything You Need for College', date: 'March 6, 2026', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80' },
  { id: '4', title: 'How to Sell Your Used Books and Electronics on CollegeMart', date: 'February 23, 2026', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80' },
  { id: '5', title: 'Budget Shopping Guide: Best Deals on Study Materials This Season', date: 'February 22, 2026', image: 'https://images.unsplash.com/photo-1524634126442-357ae0eaf6f8?auto=format&fit=crop&w=900&q=80' }
]

const trendingArticles = [
  { id: '1', title: 'Top 10 Must-Have Books for First Year Engineering Students', date: 'December 3, 2024' },
  { id: '6', title: 'Best Affordable Cycles for College Campus Travel', date: 'March 1, 2026' },
  { id: '7', title: 'Smart Shopping Tips: How to Get Maximum Value from Your College Budget', date: 'March 6, 2026' },
  { id: '8', title: 'Hostel Furniture Hacks: Maximize Your Dorm Space Smartly', date: 'May 17, 2026' },
  { id: '9', title: 'Best Smartphones Under ₹20,000 for Students in 2026', date: 'March 2, 2026' },
  { id: '10', title: 'How to Buy Second-Hand Electronics Safely on CollegeMart', date: 'January 15, 2026' }
]

const tabs = ['All', 'Books', 'Electronics', 'Furniture']

export default function BlogPage({ user, onOpenLogin }) {
  const [showAll, setShowAll] = useState(false)
  const [activeTab, setActiveTab] = useState('All')
  const { theme } = useTheme()
  const t = getThemeStyles(theme)
  const isDark = theme === 'dark'

  const allPosts = [...featuredPosts, ...articleCards, ...trendingArticles.map(a => ({ id: a.id, title: a.title, date: a.date }))]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'inherit',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      {/* Subtle decorative blobs across the blog page */}
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

        {/* Hero */}
        <section style={{ backgroundColor: 'transparent', borderBottom: `1px solid ${t.border}`, padding: '48px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.tagText, marginBottom: '12px' }}>Blog</p>
            <h1 style={{ fontSize: '36px', fontWeight: 700, color: t.textPrimary, margin: '0 0 16px', lineHeight: 1.2 }}>Smart Shopping Guide for College Essentials</h1>
            <p style={{ fontSize: '15px', color: t.textMuted, lineHeight: 1.75, maxWidth: '640px', margin: 0 }}>
              Discover tips and tricks for finding the best deals on books, electronics, and dorm essentials on CollegeMart.
            </p>
          </div>
        </section>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Latest Posts */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: t.textPrimary, margin: '0 0 6px' }}>Latest Posts</h2>
              <p style={{ fontSize: '14px', color: t.textMuted, margin: 0 }}>Fresh insights and stories from the CollegeMart blog.</p>
            </div>
            <button onClick={() => setShowAll(prev => !prev)} style={{ border: `1px solid ${t.btnOutlineBorder}`, borderRadius: '6px', padding: '9px 18px', background: t.cardBg, color: t.btnOutlineText, cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              {showAll ? 'Show Less' : 'View All'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {featuredPosts.map(post => (
              <article key={post.id} style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', overflow: 'hidden' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: t.textFaint, marginBottom: '10px' }}>{post.date}</div>
                  <h3 style={{ margin: '0 0 12px', fontSize: '18px', color: t.textPrimary, fontWeight: 700, lineHeight: 1.3 }}>{post.title}</h3>
                  <p style={{ color: t.textMuted, fontSize: '14px', lineHeight: 1.7, margin: '0 0 16px' }}>{post.summary}</p>
                  <Link to={`/blog/${post.id}`} style={{ fontSize: '13px', color: t.textSecondary, fontWeight: 700, textDecoration: 'none' }}>Read more →</Link>
                </div>
              </article>
            ))}
          </div>

          {showAll && (
            <>
              <div style={{ borderTop: `1px solid ${t.border}`, margin: '40px 0' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: t.textPrimary, margin: '0 0 20px' }}>All Posts</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {allPosts.map(post => (
                  <article key={post.id} style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '18px' }}>
                    <div style={{ fontSize: '12px', color: t.textFaint, marginBottom: '8px' }}>{post.date}</div>
                    <h4 style={{ margin: '0 0 10px', fontSize: '15px', color: t.textPrimary, fontWeight: 600 }}>{post.title}</h4>
                    {post.summary && <p style={{ margin: 0, color: t.textMuted, fontSize: '13px' }}>{post.summary}</p>}
                    <Link to={`/blog/${post.id}`} style={{ display: 'inline-block', marginTop: '12px', color: t.textSecondary, fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>Read more →</Link>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <div style={{ borderTop: `1px solid ${t.border}`, margin: '0 0 40px' }} />

        {/* Trending */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: t.textPrimary, margin: 0 }}>Trending This Month</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '7px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 500,
                    border: `1px solid ${activeTab === tab ? t.accent : t.btnOutlineBorder}`,
                    backgroundColor: activeTab === tab ? t.accent : t.cardBg,
                    color: activeTab === tab ? (theme === 'dark' ? '#0f1117' : '#ffffff') : t.btnOutlineText,
                    transition: 'all 0.18s ease'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {trendingArticles.map(article => (
              <div key={article.id} style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '18px' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '15px', color: t.textPrimary, fontWeight: 600, lineHeight: 1.4 }}>{article.title}</h3>
                <p style={{ fontSize: '12px', color: t.textFaint, margin: 0 }}>{article.date}</p>
                <Link to={`/blog/${article.id}`} style={{ display: 'inline-block', marginTop: '12px', color: t.textSecondary, fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>Read more →</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      </div>
    </div>
  )
}
