import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from '../services/api'
import Navbar from './Navbar'
import Footer from './Footer'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function SearchResultsPage({ user, onOpenLogin, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, selectedCollege, onCollegeChange, onSearchSubmit }) {
  const navigate = useNavigate()
  const query = useQuery()
  const [products, setProducts] = useState([])
  const [legalResults, setLegalResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchType, setSearchType] = useState('all')

  useEffect(() => {
    const q = query.get('q') || ''
    const categoryParam = query.get('category') || 'All'
    const type = query.get('type') || 'all'
    const normalizedCategory = categoryParam === 'All' ? '☰ ALL CATEGORIES' : categoryParam

    setSearchQuery(q)
    setSelectedCategory(normalizedCategory)
    setSearchType(type)

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
      }
    }

    const searchLegalContent = () => {
      if (!q.trim()) {
        setLegalResults([])
        return []
      }

      const searchQuery = q.toLowerCase()
      const results = []

      Object.keys(legalContent).forEach(key => {
        const item = legalContent[key]
        const content = (item.content + ' ' + item.title).toLowerCase()
        
        if (content.includes(searchQuery)) {

          const sentences = item.content.split(/(?<=[.!?])\s+/)
          const matches = sentences.filter(sentence => 
            sentence.toLowerCase().includes(searchQuery)
          )

          if (matches.length > 0) {
            results.push({
              ...item,
              category: 'Legal & Privacy Information',
              matches,
              matchCount: matches.length
            })
          }
        }
      })

      results.sort((a, b) => b.matchCount - a.matchCount)
      return results
    }

    const fetchData = async () => {
      setLoading(true)
      try {

        const legalRes = searchLegalContent()
        setLegalResults(legalRes)

        if (type !== 'legal') {
          try {
            const response = await axios.get('/api/search', {
              params: {
                q: q,
                category: (normalizedCategory && normalizedCategory !== '☰ ALL CATEGORIES') ? normalizedCategory : undefined,
                college: (selectedCollege && selectedCollege !== '') ? selectedCollege : undefined,
                limit: 100
              }
            })
            const searchResults = response.data?.data || []
            setProducts(searchResults)
          } catch (apiError) {
            console.error('Failed to fetch products from API:', apiError)
            setProducts([])
          }
        }
      } catch (error) {
        console.error('Search failed:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query.toString(), searchQuery, selectedCategory, selectedCollege])

  const handleClearSearch = () => {
    setSearchQuery('')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        onOpenLogin={onOpenLogin}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCollege={selectedCollege}
        onCollegeChange={onCollegeChange}
        onSearchSubmit={onSearchSubmit}
      />
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>
          Search results for "{query.get('q') || 'All'}"
        </h1>
        
        {}
        {legalResults.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#002f34', fontWeight: '600' }}>
              Legal & Privacy Information ({legalResults.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {legalResults.map((result, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}>
                  <Link to={result.link} style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2563eb',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '8px'
                  }}>
                    {result.title}
                  </Link>

                  <p style={{
                    fontSize: '12px',
                    color: '#999999',
                    margin: '0 0 12px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {result.category}
                  </p>

                  {result.matches.slice(0, 3).map((match, matchIdx) => (
                    <p key={matchIdx} style={{
                      fontSize: '14px',
                      color: '#334155',
                      lineHeight: '1.6',
                      marginBottom: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#f9fafb',
                      borderLeft: '3px solid #fbbf24',
                      borderRadius: '4px'
                    }}>
                      {match.split(new RegExp(`(${query.get('q')})`, 'gi')).map((part, i) => 
                        part.toLowerCase() === (query.get('q') || '').toLowerCase()
                          ? <span key={i} style={{ backgroundColor: '#fef3c7', fontWeight: '600' }}>{part}</span>
                          : part
                      )}
                    </p>
                  ))}

                  {result.matches.length > 3 && (
                    <p style={{
                      fontSize: '13px',
                      color: '#2563eb',
                      margin: '12px 0 0 0',
                      fontWeight: '500'
                    }}>
                      +{result.matches.length - 3} more matches in this page
                    </p>
                  )}

                  <Link to={result.link} style={{
                    fontSize: '13px',
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'inline-block',
                    marginTop: '12px',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    View full page →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {}
        {searchType !== 'legal' && (
          <>
            {products.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#002f34', fontWeight: '600' }}>
                  Products ({products.length})
                </h2>
              </div>
            )}

            <p style={{ marginBottom: '30px', color: '#555' }}>
              {products.length} item{products.length === 1 ? '' : 's'} found {selectedCategory !== '☰ ALL CATEGORIES' ? `in ${selectedCategory}` : ''}
            </p>
        

        {loading ? (
          <div style={{ color: '#666' }}>Loading products…</div>
          ) : products.length === 0 && legalResults.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666' }}>
              <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>No results found</h2>
            <p style={{ marginBottom: '20px' }}>Try a different search term or clear the filter.</p>
              <button
                onClick={handleClearSearch}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Clear search
              </button>
              </div>
            ) : products.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {products.map(product => {

              if (!product || !product.id) {
                console.warn('Invalid product encountered:', product)
                return null
              }
              
              return (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {}
                <div style={{
                  width: '100%',
                  height: '160px',
                  backgroundColor: '#f0f0f0',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title || 'Product'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = '<div style="font-size: 50px;">📦</div>'
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: '50px' }}>📦</div>
                  )}
                </div>

                {}
                <div style={{ padding: '12px' }}>
                  {}
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: getConditionColor(product.condition),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginRight: '6px'
                    }}>
                      {product.condition || 'N/A'}
                    </span>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: '#e0e7ff',
                      color: '#4f46e5',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginRight: '6px'
                    }}>
                      {product.category || 'Other'}
                    </span>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: product.sold ? '#fee2e2' : '#dcfce7',
                      color: product.sold ? '#dc2626' : '#16a34a',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {product.sold ? 'SOLD' : 'AVAILABLE'}
                    </span>
                  </div>

                  {}
                  <h3 style={{
                    margin: '8px 0',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#111',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {product.title || 'Untitled Product'}
                  </h3>

                  {}
                  <p style={{
                    margin: '6px 0',
                    fontSize: '12px',
                    color: '#666',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    height: '18px'
                  }}>
                    {product.description || 'No description available'}
                  </p>

                  {}
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#10b981',
                    marginBottom: '8px'
                  }}>
                    ₹ {product.price ? Number(product.price).toLocaleString('en-IN') : '0'}
                  </div>

                  {}
                  <div style={{
                    fontSize: '12px',
                    color: '#888',
                    borderTop: '1px solid #f0f0f0',
                    paddingTop: '8px'
                  }}>
                    <div style={{ marginBottom: '2px' }}>👤 {product.seller || 'Anonymous'}</div>
                    {product.college && <div style={{ marginBottom: '2px' }}>🎓 {product.college}</div>}
                    {product.createdAt && <div>⏱ {getTimeAgo(product.createdAt)}</div>}
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
                      marginTop: '10px',
                      backgroundColor: '#0ea5e9',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0284c7'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#0ea5e9'}
                  >
                    View Details
                  </button>
                </div>
              </div>
            )
            })}
          </div>
            ) : null}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

function getConditionColor(condition) {
  const colors = {
    'Brand New': '#10b981',
    'New': '#10b981',
    'Like New': '#10b981',
    'Good': '#f59e0b',
    'Fair': '#ef4444',
    'Refurbished': '#8b5cf6'
  }
  return colors[condition] || '#6b7280'
}

function getTimeAgo(createdAt) {
  try {
    if (!createdAt) return 'Recently'
    const now = new Date()
    const created = new Date(createdAt)

    if (isNaN(created.getTime())) return 'Recently'
    
    const diff = now - created
    const seconds = Math.floor(diff / 1000)
    
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  } catch (e) {
    console.warn('Error parsing date:', createdAt, e)
    return 'Recently'
  }
}
