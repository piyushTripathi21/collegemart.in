import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../services/api'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'

export default function CollegeDetailsPage({ user, onOpenLogin, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, selectedCollege, setSelectedCollege, onCollegeChange, onSearchSubmit }) {
  const { collegeName } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [college, setCollege] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState({})

  const pageBg = isDark ? '#0f1117' : theme === 'ocean' ? '#e8f4fd' : theme === 'sunset' ? '#fff3e8' : 'var(--bg-gradient)'
  const cardBg = isDark ? '#1e2130' : '#ffffff'
  const titleColor = isDark ? '#e8eaf0' : '#002f34'
  const textMuted = isDark ? '#8892a4' : '#777'
  const borderClr = isDark ? '#2e3347' : '#e0e0e0'

  const goHome = () => {
    if (onCollegeChange) onCollegeChange('')
    if (setSelectedCategory) setSelectedCategory('☰ ALL CATEGORIES')
    if (setSearchQuery) setSearchQuery('')
    navigate('/')
  }

  useEffect(() => {
    const loadCollegeProducts = async () => {
      const decodedName = decodeURIComponent(collegeName)
      try {
        setLoading(true)
        const response = await axios.get('/api/colleges/find', { params: { name: decodedName } })
        const foundCollege = response.data
        setCollege(foundCollege)
        
        if (setSelectedCollege) setSelectedCollege(foundCollege.short)
        if (setSelectedCategory) setSelectedCategory('☰ ALL CATEGORIES')
        if (setSearchQuery) setSearchQuery('')

        const productsResponse = await axios.get('/api/products', {
          params: { college: foundCollege.short, limit: 100 }
        })
        const filtered = productsResponse.data?.data || []
        setProducts(filtered)
      } catch (error) {
        console.error('Error loading college products:', error)
        setProducts([])
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    loadCollegeProducts()
  }, [collegeName, navigate])

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) { setLiked({}); return }
      try {
        const response = await axios.get(`/api/users/${user.id}/favorites`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        const likedMap = {}
        ;(response.data?.data || response.data || []).forEach(fav => { likedMap[fav.id] = true })
        setLiked(likedMap)
      } catch {}
    }
    loadFavorites()
  }, [user])

  const toggleLike = async (e, productId) => {
    e.stopPropagation()
    if (!user) { onOpenLogin(); return }
    const isFav = liked[productId]
    try {
      if (isFav) {
        await axios.delete(`/api/users/${user.id}/favorites/${productId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      } else {
        await axios.post(`/api/users/${user.id}/favorites`, { product_id: productId }, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      }
      setLiked(prev => ({ ...prev, [productId]: !isFav }))
    } catch (err) {
      console.error('Favorite error:', err)
    }
  }

  const getConditionColor = (condition) => {
    const colors = { 'Like New': '#10b981', 'New': '#10b981', 'Good': '#f59e0b', 'Fair': '#ef4444' }
    return colors[condition] || '#6b7280'
  }

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return 'Recently'
    const seconds = Math.floor((new Date() - new Date(createdAt)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const navbarProps = { user, onOpenLogin, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, selectedCollege, onCollegeChange, onSearchSubmit }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg }}>
        <Navbar {...navbarProps} />
        <div style={{ textAlign: 'center', padding: '80px 20px', color: textMuted, fontSize: '18px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          Loading college products...
        </div>
        <Footer />
      </div>
    )
  }

  if (!college) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg }}>
        <Navbar {...navbarProps} />
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏫</div>
          <h2 style={{ color: titleColor, marginBottom: '12px' }}>College not found</h2>
          <button onClick={goHome} style={{
            padding: '12px 32px', backgroundColor: 'var(--accent)', color: '#002f34',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600'
          }}>Back to Home</button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: pageBg }}>
      <Navbar {...navbarProps} />

      {}
      <div style={{
        background: isDark
          ? 'linear-gradient(135deg, #0f2033 0%, #1a1060 100%)'
          : 'linear-gradient(135deg, #23e5db 0%, #6366f1 60%, #8b5cf6 100%)',
        color: 'white',
        padding: '48px 20px',
        textAlign: 'center',
        borderBottom: `1px solid ${borderClr}`
      }}>
        <button
          onClick={goHome}
          style={{
            background: 'rgba(255,255,255,0.15)', color: 'white',
            border: '1px solid rgba(255,255,255,0.3)', padding: '8px 18px',
            borderRadius: '8px', cursor: 'pointer', marginBottom: '20px',
            fontSize: '14px', transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
        >
          ← Back to Home
        </button>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>🏫</div>
        <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>{college.short}</h1>
        <p style={{ fontSize: '15px', opacity: 0.8, marginBottom: '6px' }}>{college.name}</p>
        <p style={{ fontSize: '14px', opacity: 0.65 }}>
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </p>
      </div>

      {}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {products.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${borderClr}`
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📦</div>
            <h2 style={{ color: titleColor, marginBottom: '10px' }}>No products yet for {college.short}</h2>
            <p style={{ color: textMuted, marginBottom: '28px' }}>
              Be the first student from {college.name} to list something!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { if (onCollegeChange) onCollegeChange(''); navigate('/sell') }}
                style={{
                  padding: '12px 32px', backgroundColor: 'var(--accent)', color: '#002f34',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600'
                }}
              >
                + Add Products
              </button>
              <button
                onClick={goHome}
                style={{
                  padding: '12px 32px', backgroundColor: 'transparent', color: titleColor,
                  border: `2px solid ${borderClr}`, borderRadius: '8px', cursor: 'pointer', fontSize: '15px'
                }}
              >
                Browse All
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {products.map(product => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                style={{
                  backgroundColor: cardBg, borderRadius: '12px', overflow: 'hidden',
                  border: `1px solid ${borderClr}`, cursor: 'pointer',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(35,229,219,0.25), 0 4px 20px rgba(35,229,219,0.35), 0 8px 32px rgba(35,229,219,0.15)'
                  e.currentTarget.style.borderColor = 'var(--accent)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = borderClr
                }}
              >
                {}
                <div style={{
                  position: 'relative', height: '190px',
                  backgroundColor: isDark ? '#252836' : '#f5f5f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                }}>
                  {product.image ? (
                    <img src={product.image} alt={product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '56px' }}>📦</div>
                  )}
                  <button
                    onClick={e => toggleLike(e, product.id)}
                    style={{
                      position: 'absolute', top: '10px', right: '10px',
                      backgroundColor: 'rgba(255,255,255,0.9)', border: 'none',
                      width: '36px', height: '36px', borderRadius: '50%',
                      cursor: 'pointer', fontSize: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {liked[product.id] ? '❤️' : '🤍'}
                  </button>
                </div>

                {}
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    {product.condition && (
                      <span style={{
                        padding: '3px 10px', backgroundColor: getConditionColor(product.condition),
                        color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600'
                      }}>
                        {product.condition}
                      </span>
                    )}
                    <span style={{
                      padding: '3px 10px',
                      backgroundColor: product.sold ? '#fee2e2' : '#dcfce7',
                      color: product.sold ? '#dc2626' : '#16a34a',
                      borderRadius: '4px', fontSize: '12px', fontWeight: '600'
                    }}>
                      {product.sold ? 'SOLD' : 'AVAILABLE'}
                    </span>
                  </div>

                  {product.category && (
                    <div style={{
                      display: 'inline-block', marginBottom: '6px', padding: '3px 10px',
                      backgroundColor: isDark ? '#2e3347' : '#e0e7ff',
                      color: isDark ? '#a5b4fc' : '#4f46e5',
                      borderRadius: '4px', fontSize: '12px', fontWeight: '600'
                    }}>
                      {product.category}
                    </div>
                  )}

                  <h3 style={{
                    margin: '6px 0', fontSize: '15px', fontWeight: '700', color: titleColor,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {product.title}
                  </h3>

                  {product.description && (
                    <p style={{
                      margin: '0 0 8px', fontSize: '13px', color: textMuted,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {product.description}
                    </p>
                  )}

                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' }}>
                    ₹ {product.price?.toLocaleString('en-IN') || 0}
                  </div>

                  <div style={{
                    fontSize: '12px', color: textMuted,
                    borderTop: `1px solid ${borderClr}`, paddingTop: '10px',
                    display: 'flex', flexDirection: 'column', gap: '3px'
                  }}>
                    {product.seller && <span>👤 {product.seller}</span>}
                    {product.college && <span>🎓 {product.college}</span>}
                    <span>⏱ {getTimeAgo(product.created_at || product.createdAt)}</span>
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`) }}
                    style={{
                      width: '100%', marginTop: '12px', padding: '10px',
                      backgroundColor: 'var(--accent)', color: '#002f34',
                      border: 'none', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '14px', fontWeight: '700', transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.85'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
