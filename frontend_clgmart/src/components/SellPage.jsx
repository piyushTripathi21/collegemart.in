import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

const CATEGORIES = ['Books', 'Electronics', 'Clothing', 'Stationery', 'Sports', 'Home & Living', 'Beauty', 'Other']

export default function SellPage({ user, onOpenLogin }) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const t = getThemeStyles(theme)
  const isDark = theme === 'dark'
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState('Good')
  const [category, setCategory] = useState('Books')
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [sellerName, setSellerName] = useState(user?.name || '')
  const [sellerPhone, setSellerPhone] = useState(user?.phone || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'inherit',
        transition: 'background 0.3s ease, color 0.3s ease'
      }}>
        {}
        <div style={{
          position: 'absolute', top: '100px', right: '-150px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: isDark ? 'rgba(35,229,219,0.03)' : 'rgba(14,165,233,0.05)',
          pointerEvents: 'none',
          filter: 'blur(100px)',
          zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar user={user} onOpenLogin={onOpenLogin} />
          <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: '60vh' }}>
            <h2 style={{ color: t.textPrimary }}>Please log in to sell your product</h2>
            <button
              onClick={onOpenLogin}
              style={{
                padding: '10px 20px',
                backgroundColor: t.btnPrimaryBg,
                color: t.btnPrimaryText,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '20px',
                fontSize: '16px'
              }}
            >
              Login
            </button>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) {
      setImages([])
      setPreviews([])
      return
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    const oversizedFile = files.find(file => file.size > MAX_SIZE);
    if (oversizedFile) {
      setError(`File "${oversizedFile.name}" is too large. Maximum size is 5MB.`);
      e.target.value = null; // Clear input
      setImages([]);
      setPreviews([]);
      return;
    }

    const invalidTypeFile = files.find(file => !file.type.startsWith('image/'));
    if (invalidTypeFile) {
      setError(`File "${invalidTypeFile.name}" is not a valid image format.`);
      e.target.value = null; // Clear input
      setImages([]);
      setPreviews([]);
      return;
    }

    setError('');
    setImages(files)
    const previewsArray = new Array(files.length)
    let completed = 0
    files.forEach((file, index) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        previewsArray[index] = reader.result
        completed += 1
        if (completed === files.length) {
          setPreviews(previewsArray)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title || !price || images.length < 2) {
      setError('Please upload at least 2 images of your product before listing')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('condition', condition)
      formData.append('category', category)
      formData.append('location', user?.college || '')
      formData.append('user_id', user?.id)
      images.forEach((file) => formData.append('images', file))

      await axios.post('/api/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        }
      })

      setSuccess(true)
      setError('')
      setTitle('')
      setDescription('')
      setPrice('')
      setCondition('Good')
      setCategory('Books')
      setImages([])
      setPreviews([])
      setSellerName(user?.name || '')
      setSellerPhone(user?.phone || '')
      navigate('/')
    } catch (err) {
      console.error('Error saving product:', err, err.response?.data)

      const serverMsg = err.response?.data?.error || err.response?.data || null
      const status = err.response?.status
      if (status === 401) {
        setError('You are not authenticated. Please login and try again.')
        if (onOpenLogin) onOpenLogin()
      } else if (serverMsg) {
        setError(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg))
      } else {
        setError(err.message || 'Failed to save product. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'inherit',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      {}
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
        <div style={{ minHeight: '80vh', backgroundColor: 'transparent', padding: '40px 20px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px', color: t.textPrimary }}>
              📦 Sell Your Product
            </h1>
            <p style={{ color: t.textMuted, marginBottom: '40px', fontSize: '14px' }}>
              Fill in the details below to list your product. Your item will appear in Fresh Recommendations.
            </p>

            <form onSubmit={handleSubmit}>
              {}
              <div style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.border}`,
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', fontSize: '16px', color: t.textPrimary }}>
                  Product Images * <span style={{ color: t.textMuted, fontSize: '12px' }}>(Minimum 2 required, up to 6)</span>
                </label>
                
                {previews.length > 0 ? (
                  <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                    {previews.map((src, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={src}
                          alt={`preview-${index}`}
                          style={{
                            width: '100%',
                            height: '120px',
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setImages([])
                        setPreviews([])
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        fontSize: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : null}
                
                <input
                  type="file"
                  accept="image}
              <div style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.border}`,
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: t.textPrimary }}>Product Details</h3>

                 {}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: t.textSecondary }}>
                    Product Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Used Physics Textbook"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${t.border}`,
                      backgroundColor: t.inputBg,
                      color: t.textPrimary,
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                    required
                  />
                </div>

                {}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: t.textSecondary }}>
                    Description
                  </label>
                  <textarea
                    placeholder="Tell us more about the product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${t.border}`,
                      backgroundColor: t.inputBg,
                      color: t.textPrimary,
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: t.textSecondary }}>
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="1"
                      max="1000000"
                      step="1"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${t.border}`,
                        backgroundColor: t.inputBg,
                        color: t.textPrimary,
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: t.textSecondary }}>
                      Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${t.border}`,
                        backgroundColor: t.inputBg,
                        color: t.textPrimary,
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option>Brand New</option>
                      <option>Good</option>
                      <option>Fair</option>
                      <option>Refurbished</option>
                    </select>
                  </div>
                </div>

                {}
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: t.textSecondary }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${t.border}`,
                      backgroundColor: t.inputBg,
                      color: t.textPrimary,
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {}
              <div style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.border}`,
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: t.textPrimary }}>Your Contact Information</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: t.textSecondary }}>
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${t.border}`,
                        backgroundColor: t.inputBg,
                        color: t.textPrimary,
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: t.textSecondary }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${t.border}`,
                        backgroundColor: t.inputBg,
                        color: t.textPrimary,
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
              </div>

              {}
              {error && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              {}
              {success && (
                <div style={{
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  ✓ Product listed successfully! Redirecting to home...
                </div>
              )}

              {}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 40px',
                    backgroundColor: loading ? '#ccc' : t.accent,
                    color: theme === 'dark' ? '#0f1117' : '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {loading ? 'Saving...' : '✓ Save & List Product'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  style={{
                    padding: '12px 40px',
                    backgroundColor: t.cardBgAlt,
                    color: t.textPrimary,
                    border: `1px solid ${t.border}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
