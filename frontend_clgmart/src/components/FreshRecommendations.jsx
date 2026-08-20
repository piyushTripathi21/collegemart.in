import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'
import { useTheme } from '../context/ThemeContext'

const getNormalizedCategory = (category) => {
  if (!category || category === '☰ ALL CATEGORIES' || category === 'All' || category === '') {
    return 'ALL';
  }
  const clean = category.toLowerCase().trim();
  const map = {
    'books': 'Books & Notes',
    'books & notes': 'Books & Notes',
    'electronics': 'Electronics',
    'cycles': 'Cycles & Bikes',
    'cycles & bikes': 'Cycles & Bikes',
    'furniture': 'Hostel Furniture',
    'hostel furniture': 'Hostel Furniture',
    'clothing': 'Clothing',
    'stationery': 'Stationery',
    'sports': 'Sports & Hobbies',
    'sports & hobbies': 'Sports & Hobbies',
    'lab': 'Lab Equipment',
    'lab equipment': 'Lab Equipment',
    'gadgets': 'Gadgets',
    'bags': 'Bags & Luggage',
    'bags & luggage': 'Bags & Luggage',
    'kitchen': 'Kitchen Items',
    'kitchen items': 'Kitchen Items',
    'services': 'Services'
  };
  return map[clean] || category;
}

const FreshRecommendations = forwardRef(({ selectedCategory, selectedCollege }, ref) => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [showAll, setShowAll] = useState(false)
  const { theme } = useTheme()

  const isDark = theme === 'dark'
  const themeStyles = {
    pageBg:    isDark ? '#0d1117' : theme === 'ocean' ? '#e8f4fd' : theme === 'sunset' ? '#fff3e8' : '#f9fafb',
    cardBg:    isDark ? '#1e2235' : '#ffffff',
    imageBg:   isDark ? 'linear-gradient(135deg, #1e2235 0%, #1a2a3a 100%)' : 'linear-gradient(135deg, #e8f8ff 0%, #d4f5f2 100%)',
    titleColor:isDark ? '#e8eaf0' : '#111111',
    textMuted: isDark ? '#8892a4' : '#666666',
    borderClr: isDark ? '#2e3347' : '#f0f0f0',
    cardShadow:isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
    btnBg:     isDark ? '#23e5db' : '#0ea5e9',
    btnColor:  isDark ? '#0d1117' : '#ffffff',
  }

  const fetchFreshProducts = async () => {
    try {
      const categoryKey = getNormalizedCategory(selectedCategory)
      const params = {
        category: categoryKey !== 'ALL' ? categoryKey : undefined,
        college: selectedCollege || undefined,
        limit: 100
      }
      const response = await axios.get('/api/products', { params })
      let freshProducts = response.data?.data || []
      if (categoryKey !== 'ALL') {
        freshProducts = freshProducts.filter(p => p.category === categoryKey || p.category?.toLowerCase() === categoryKey.toLowerCase())
      }
      setProducts(freshProducts)
    } catch (error) {
      console.error('Failed to fetch fresh products:', error)
      setProducts([])
    }
  }

  useImperativeHandle(ref, () => ({
    refresh: () => {
      fetchFreshProducts()
    }
  }))

  useEffect(() => {
    fetchFreshProducts()
  }, [selectedCategory, selectedCollege])

  if (products.length === 0) {
    return (
      <section style={{ padding: '40px 20px', background: 'transparent', minHeight: '300px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', color: themeStyles.textMuted }}>
          <h2 className="section-title">
            Newly Added Items
          </h2>
          <p style={{ fontSize: '16px', margin: '40px 0', color: themeStyles.textMuted }}>
            No products listed yet. Start selling to see fresh recommendations! 🎉
          </p>
        </div>
      </section>
    )
  }

  return (
    <section style={{ padding: '40px 20px', background: 'transparent' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <h2 className="section-title" style={{ margin: '0' }}>
            Newly Added Items
          </h2>
          {products.length > 8 && (
            <button
              onClick={() => setShowAll(prev => !prev)}
              style={{
                background: 'none',
                border: '1.5px solid var(--text-primary)',
                color: 'var(--text-primary)',
                borderRadius: '20px',
                padding: '5px 18px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--text-primary)'
                e.currentTarget.style.color = isDark ? '#0d1117' : '#ffffff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
            >
              {showAll ? '← Show Less' : 'View More →'}
            </button>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {(showAll ? products : products.slice(0, 8)).map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{
                backgroundColor: themeStyles.cardBg,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: themeStyles.cardShadow,
                border: `1px solid ${themeStyles.borderClr}`,
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(35, 229, 219, 0.25), 0 4px 20px rgba(35, 229, 219, 0.35), 0 8px 32px rgba(35, 229, 219, 0.15)'
                e.currentTarget.style.borderColor = 'var(--accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = themeStyles.cardShadow
                e.currentTarget.style.borderColor = themeStyles.borderClr
              }}
            >
              {}
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: themeStyles.imageBg,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ fontSize: '50px' }}>📦</div>
                )}
              </div>

              {}
              <div style={{ padding: '15px' }}>
                {}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    backgroundColor: getConditionColor(product.condition),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginBottom: '8px',
                    marginRight: '6px',
                    fontWeight: '600'
                  }}>
                    {product.condition}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    backgroundColor: product.sold ? '#fee2e2' : '#dcfce7',
                    color: product.sold ? '#dc2626' : '#16a34a',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {product.sold ? 'SOLD' : 'AVAILABLE'}
                  </div>
                </div>

                {}
                <div style={{
                  display: 'inline-block',
                  marginLeft: '8px',
                  padding: '4px 10px',
                  backgroundColor: isDark ? '#2e3347' : '#e0e7ff',
                  color: isDark ? '#a5b4fc' : '#4f46e5',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginBottom: '8px',
                  fontWeight: '600'
                }}>
                  {product.category}
                </div>

                {}
                <h3 style={{
                  margin: '10px 0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: themeStyles.titleColor,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {product.title}
                </h3>

                {}
                {product.description && (
                  <p style={{
                    margin: '8px 0',
                    fontSize: '13px',
                    color: themeStyles.textMuted,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    height: '20px'
                  }}>
                    {product.description}
                  </p>
                )}

                {}
                <div style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#10b981',
                  marginBottom: '10px'
                }}>
                  ₹ {product.price?.toLocaleString('en-IN') || 0}
                </div>

                {}
                <div style={{
                  fontSize: '12px',
                  color: themeStyles.textMuted,
                  marginBottom: '10px',
                  borderTop: `1px solid ${themeStyles.borderClr}`,
                  paddingTop: '10px'
                }}>
                  <div>👤 {product.seller || 'Anonymous'}</div>
                  {product.college && <div>🎓 {product.college}</div>}
                  <div>⏱ {getTimeAgo(product.createdAt)}</div>
                </div>

                {}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/product/${product.id}`)
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: themeStyles.btnBg,
                    color: themeStyles.btnColor,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => { e.target.style.opacity = '0.85' }}
                  onMouseLeave={(e) => { e.target.style.opacity = '1' }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

FreshRecommendations.displayName = 'FreshRecommendations'

export default FreshRecommendations

function getConditionColor(condition) {
  const colors = {
    'Brand New': '#10b981',
    'Good': '#f59e0b',
    'Fair': '#ef4444',
    'Refurbished': '#8b5cf6'
  }
  return colors[condition] || '#6b7280'
}

function getTimeAgo(createdAt) {
  try {
    const now = new Date()
    const created = new Date(createdAt)
    const diff = now - created
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    
    return created.toLocaleDateString('en-IN')
  } catch (e) {
    return 'Recently'
  }
}
