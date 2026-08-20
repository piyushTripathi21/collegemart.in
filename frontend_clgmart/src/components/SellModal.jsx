import React, { useState, useRef } from 'react'
import axios from '../services/api'

export default function SellModal({ isOpen, onClose, user, onUploadSuccess }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState('Good')
  const [category, setCategory] = useState('Books')
  const [phone, setPhone] = useState(user?.phone || '')
  const [contactName, setContactName] = useState(user?.name || '')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title || !price || !image) {
      setError('Please fill all required fields and upload an image')
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
      formData.append('user_id', user.id)
      formData.append('contact_name', contactName)
      formData.append('phone', phone)
      formData.append('image', image)

      const response = await axios.post('/api/products/upload', formData, {
        headers: {
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        }
      })

      alert('Product listed successfully! Check Fresh Recommendations.')

      setTitle('')
      setDescription('')
      setPrice('')
      setCondition('Good')
      setCategory('Books')
      setImage(null)
      setPreview(null)

      if (onUploadSuccess) {

        onUploadSuccess()
      }
      
      onClose()
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.response?.data?.error || 'Failed to upload product')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      overflowY: 'auto',
      paddingTop: '20px',
      paddingBottom: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '40px',
        maxWidth: '600px',
        width: '90%',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '30px', textAlign: 'center' }}>
          Sell Your Product
        </h2>

        <form onSubmit={handleSubmit}>
          {}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Product Image *
            </label>
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{
                  maxWidth: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  marginBottom: '10px',
                  borderRadius: '4px'
                }}
              />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image}
          <input
            type="text"
            placeholder="Product Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            required
          />

          {}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <input
              type="number"
              placeholder="Price (₹) *"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option>Brand New</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Refurbished</option>
            </select>
          </div>

          {}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option>Books</option>
            <option>Electronics</option>
            <option>Cycles & Bikes</option>
            <option>Hostel Furniture</option>
            <option>Clothing</option>
            <option>Others</option>
          </select>

          {}
          <textarea
            placeholder="Product Description (Details about condition, usage, etc.)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
              minHeight: '100px'
            }}
          />

          {}
          <input
            type="text"
            placeholder="Your Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            required
          />

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '12px',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          {}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Uploading...' : '✓ List Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px',
                backgroundColor: '#f0f0f0',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
