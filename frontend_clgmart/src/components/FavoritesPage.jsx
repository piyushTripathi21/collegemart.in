import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'

export default function FavoritesPage({ user, onOpenLogin }) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  // Theme-aware colors (matching CategoryPage)
  const pageBg = isDark ? '#0f1117' : theme === 'ocean' ? '#e8f4fd' : theme === 'sunset' ? '#fff3e8' : '#f2f4f5'
  const cardBg = isDark ? '#1e2130' : '#ffffff'
  const titleColor = isDark ? '#e8eaf0' : '#002f34'
  const textMuted = isDark ? '#8892a4' : '#777'
  const borderClr = isDark ? '#2e3347' : '#e0e0e0'

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) { navigate('/'); return }
      try {
        const response = await axios.get(`/api/users/${user.id}/favorites`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setFavorites(response.data.data || [])
      } catch (error) {
        console.error('Error loading favorites:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFavorites()
  }, [user, navigate])

  const removeFavorite = async (e, productId) => {
    e.stopPropagation()
    try {
      await axios.delete(`/api/users/${user.id}/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setFavorites(prev => prev.filter(fav => fav.id !== productId))
    } catch (error) {
      console.error('Failed to remove favorite:', error)
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle decorative blobs across the favorites page */}
      <div style={{
        position: 'absolute', top: '100px', right: '-150px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: isDark ? 'rgba(35,229,219,0.03)' : 'rgba(14,165,233,0.05)',
        pointerEvents: 'none',
        filter: 'blur(100px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: '150px', left: '-150px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.05)',
        pointerEvents: 'none',
        filter: 'blur(100px)',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar user={user} onOpenLogin={onOpenLogin} />

        {/* Hero Header — premium themed gradient matching CategoryPage */}
        <div style={{
          background: isDark
            ? 'linear-gradient(135deg, #0f2033 0%, #1a1060 100%)'
            : 'linear-gradient(135deg, #23e5db 0%, #6366f1 60%, #8b5cf6 100%)',
          color: 'white',
          padding: '48px 20px',
          textAlign: 'center',
          borderBottom: `1px solid ${borderClr}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* decorative circles */}
          <div style={{
            position: 'absolute', top: '-40px', right: '120px',
            width: '160px', height: '160px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-30px', right: '-20px',
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
          }} />

          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 18px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '600',
              position: 'relative',
              zIndex: 2,
              transition: 'background 0.2s, transform 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            ← Back to Home
          </button>
          <div style={{ fontSize: '52px', marginBottom: '12px', position: 'relative', zIndex: 2 }}>❤️</div>
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '8px', color: 'white', position: 'relative', zIndex: 2 }}>My Favorites</h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', position: 'relative', zIndex: 2 }}>
            {loading ? 'Loading...' : `${favorites.length} ${favorites.length === 1 ? 'product' : 'products'} saved`}
          </p>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: textMuted, fontSize: '18px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              Loading your favorites...
            </div>
          ) : favorites.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              backgroundColor: cardBg, borderRadius: '16px',
              border: `1px solid ${borderClr}`,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>💔</div>
              <h2 style={{ color: titleColor, marginBottom: '10px' }}>No favorites yet</h2>
              <p style={{ color: textMuted, marginBottom: '24px' }}>
                Browse products and tap ❤️ to save them here!
              </p>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '12px 32px', backgroundColor: 'var(--accent)', color: '#002f34',
                  border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '15px', fontWeight: '600'
                }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px'
            }}>
              {favorites.map(product => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `1px solid ${borderClr}`,
                    cursor: 'pointer',
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
                  {/* Image */}
                  <div style={{
                    position: 'relative', height: '190px',
                    backgroundColor: isDark ? '#252836' : '#f5f5f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                  }}>
                    {(product.image_url || product.image) ? (
                      <img
                        src={product.image_url || product.image}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ fontSize: '56px' }}>📦</div>
                    )}
                    {/* Remove button */}
                    <button
                      onClick={e => removeFavorite(e, product.id)}
                      title="Remove from favorites"
                      style={{
                        position: 'absolute', top: '10px', right: '10px',
                        backgroundColor: '#ef4444', border: 'none',
                        width: '34px', height: '34px', borderRadius: '50%',
                        cursor: 'pointer', fontSize: '16px', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                        transition: 'transform 0.2s, background 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.transform = 'scale(1.1)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.transform = 'scale(1)' }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '14px' }}>
                    {/* Condition + Status badges */}
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

                    {/* Category label */}
                    {product.category && (
                      <div style={{
                        display: 'inline-block', marginBottom: '6px',
                        padding: '3px 10px',
                        backgroundColor: isDark ? '#2e3347' : '#e0e7ff',
                        color: isDark ? '#a5b4fc' : '#4f46e5',
                        borderRadius: '4px', fontSize: '12px', fontWeight: '600'
                      }}>
                        {product.category}
                      </div>
                    )}

                    <h3 style={{
                      margin: '6px 0', fontSize: '15px', fontWeight: '700',
                      color: titleColor, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap'
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
                      ₹ {parseFloat(product.price || 0).toLocaleString('en-IN')}
                    </div>

                    <div style={{
                      fontSize: '12px', color: textMuted,
                      borderTop: `1px solid ${borderClr}`, paddingTop: '10px',
                      display: 'flex', flexDirection: 'column', gap: '3px'
                    }}>
                      {(product.location || product.college) && (
                        <span>📍 {product.college || product.location}</span>
                      )}
                      {product.condition && <span>📦 Condition: {product.condition}</span>}
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
    </div>
  )
}
