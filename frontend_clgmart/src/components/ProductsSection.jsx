import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'

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

export default function ProductsSection({ selectedCategory = '☰ ALL CATEGORIES', selectedCollege = '', searchQuery = '', user, onOpenLogin }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState({})
  const [products, setProducts] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryKey = getNormalizedCategory(selectedCategory)
        const params = {
          category: categoryKey !== 'ALL' ? categoryKey : undefined,
          college: selectedCollege || undefined,
          limit: 100
        }
        const response = await axios.get('/api/products', { params })
        setProducts(response.data?.data || response.data || [])
      } catch (error) {
        console.error('Failed to load products:', error)
      }
    }

    fetchProducts()
  }, [selectedCategory, selectedCollege])

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setLiked({})
        return
      }

      try {
        const response = await axios.get(`/api/users/${user.id}/favorites`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        const likedMap = {}
        ;(response.data?.data || response.data || []).forEach(fav => {
          likedMap[fav.id] = true
        })
        setLiked(likedMap)
      } catch (error) {
        console.error('Failed to load favorites:', error)
      }
    }

    loadFavorites()
  }, [user])

  const displayedProducts = products

  const categoryKey = getNormalizedCategory(selectedCategory)

  const categoryFiltered = categoryKey === 'ALL'
    ? displayedProducts
    : displayedProducts.filter(p => p.category === categoryKey || p.category?.toLowerCase() === categoryKey.toLowerCase())

  const collegeFiltered = selectedCollege
    ? categoryFiltered.filter(p => p.college === selectedCollege)
    : categoryFiltered

  const searchTerm = searchQuery.trim().toLowerCase()
  const searchTerms = searchTerm.split(' ').filter(Boolean)

  const filteredProducts = searchTerms.length
    ? collegeFiltered.filter((product) => {
        const searchable = [
          product.title,
          product.description,
          product.category,
          product.location,
          product.college,
          product.seller
        ]
          .map(field => field?.toString().toLowerCase() || '')
          .join(' ')

        return searchTerms.every(term => searchable.includes(term))
      })
    : collegeFiltered

  const getConditionClass = (condition) => {
    if (condition === 'Like New' || condition === 'New') return 'condition-good'
    if (condition === 'Good') return 'condition-amber'
    return 'condition-red'
  }

  const toggleLike = async (id) => {
    if (!user) {
      onOpenLogin()
      return
    }

    const product = displayedProducts.find(p => p.id === id)
    if (!product) return

    const isFavorite = liked[id]
    try {
      if (isFavorite) {
        await axios.delete(`/api/users/${user.id}/favorites/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
      } else {
        await axios.post(`/api/users/${user.id}/favorites`, { product_id: id }, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
      }

      setLiked(prev => ({
        ...prev,
        [id]: !isFavorite
      }))
    } catch (error) {
      console.error('Unable to update favorites:', error)
      alert('Could not update favorites. Please try again.')
    }
  }

  const categoryDisplayName = selectedCategory.replace('☰ ', '')

  const isFreshView = categoryDisplayName === 'ALL CATEGORIES' && !searchQuery.trim()
  const visibleProducts = isFreshView && !showAll ? filteredProducts.slice(0, 8) : filteredProducts

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '4px'
      }}>
        <h2 className="section-title" style={{ margin: 0 }}>
          {categoryDisplayName === 'ALL CATEGORIES' ? 'Fresh recommendations' : `${categoryDisplayName} (${filteredProducts.length})`}
        </h2>
        {isFreshView && filteredProducts.length > 8 && (
          <button
            onClick={() => setShowAll(prev => !prev)}
            style={{
              background: 'none',
              border: '1.5px solid var(--text-primary, #002f34)',
              color: 'var(--text-primary, #002f34)',
              borderRadius: '20px',
              padding: '5px 18px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              marginBottom: '4px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--text-primary, #002f34)'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.color = 'var(--text-primary, #002f34)'
            }}
          >
            {showAll ? '← Show Less' : 'View More →'}
          </button>
        )}
      </div>
      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
            <p>No products available in this category</p>
          </div>
        ) : (
          <>
            {visibleProducts.map((product) => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-card-image">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div>{product.emoji || '📦'}</div>
                  )}
                  {!!product.featured && <span className="featured-badge">FEATURED</span>}
                  <button 
                    className="heart-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLike(product.id)
                    }}
                  >
                    {liked[product.id] ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-price">₹ {product.price.toLocaleString('en-IN')}</div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <div className={`condition-badge ${getConditionClass(product.condition)}`}>
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
                  <div className="product-title">{product.title}</div>
                  <div className="product-meta">
                    <span>📍 {product.location}</span>
                    <span>{product.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <div 
               className="sell-cta-card"
               onClick={() => {
                 if (user) {
                   navigate('/sell')
                 } else {
                   onOpenLogin()
                 }
               }}
             >
               <h3>Want to see your stuff here?</h3>
               <button className="btn-outline">Start selling</button>
             </div>
          </>
        )}
      </div>
    </div>
  )
}
