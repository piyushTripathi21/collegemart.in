import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../services/api'
import Navbar from './Navbar'
import Footer from './Footer'
import { io } from 'socket.io-client'
import { useToast } from '../context/ToastContext'

export default function ProductDetailsPage({ user, onOpenLogin }) {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [chatMessage, setChatMessage] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')
  const [chatReceiverId, setChatReceiverId] = useState(null)
  const [chatPartnerName, setChatPartnerName] = useState('')
  const [markingSold, setMarkingSold] = useState(false)
  const [soldSuccess, setSoldSuccess] = useState(false)
  const socketRef = useRef(null)
  const { showToast } = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/products/${productId}`)
        setProduct(response.data)
      } catch (error) {
        console.error('Error fetching product details:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0)
    }
  }, [product])

  useEffect(() => {
    if (!user) return
    const socketUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin)
    const socket = io(socketUrl, {
      auth: { token: user.token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000
    })
    socketRef.current = socket

    socket.on('connect_error', (err) => {
      console.error('Socket connect error', err)
      showToast('Real-time connection failed. Retrying...', 'warning', 3000)
    })

    socket.on('reconnect_failed', () => {
      showToast('Real-time connection lost. Please refresh the page.', 'error', 5000)
    })

    socket.on('connect_timeout', () => {
      showToast('Real-time connection timeout. Retrying...', 'warning', 3000)
    })

    socket.on('new_message', (msg) => {
      // append message if relevant to current product
      if (!msg || !product || msg.product_id !== product.id) return
      setMessages((prev) => {
        if (prev.some((existing) => existing.id === msg.id)) {
          return prev
        }
        return [...prev, msg]
      })
    })

    return () => {
      try { socket.disconnect() } catch (e) {}
      socketRef.current = null
    }
  }, [user, product, showToast])

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user || !product) {
        return
      }

      try {
        const response = await axios.get(`/api/users/${user.id}/favorites`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })

        setIsFavorite((response.data?.data || response.data || []).some(fav => fav.id === product.id))
      } catch (error) {
        console.error('Error checking favorite status:', error)
      }
    }

    fetchFavoriteStatus()
  }, [product, user])

  const handleAddToFavorites = async () => {
    if (!user) {
      onOpenLogin()
      return
    }

    try {
      if (isFavorite) {
        await axios.delete(`/api/users/${user.id}/favorites/${product.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        setIsFavorite(false)
      } else {
        await axios.post(`/api/users/${user.id}/favorites`, { product_id: product.id }, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
      alert('Unable to update favorites. Please try again.')
    }
  }

  const handleMarkSold = async () => {
    if (!user) {
      onOpenLogin()
      return
    }

    if (user.id !== product.user_id) {
      alert('Only the seller can mark this product as sold')
      return
    }

    try {
      setMarkingSold(true)
      const response = await axios.post(`/api/products/${product.id}/mark-sold`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      // Update user coins in localStorage
      const updatedUser = {
        ...user,
        coins: response.data.total_coins
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      window.dispatchEvent(new Event('userProfileUpdated'))

      setSoldSuccess(true)
      setProduct({ ...product, sold: true })
      alert(`Product marked as sold! You earned ${response.data.coins_earned} coins. Total coins: ${response.data.total_coins}`)
      
      setTimeout(() => {
        setSoldSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error marking product as sold:', error)
      alert(error.response?.data?.error || 'Unable to mark product as sold. Please try again.')
    } finally {
      setMarkingSold(false)
    }
  }

  const handleCall = () => {
    if (product?.sellerPhone) {
      window.location.href = `tel:${product.sellerPhone}`
    } else {
      alert('Seller phone number not available')
    }
  }

  const loadMessages = async () => {
    if (!user || !product) return

    try {
      setChatLoading(true)
      const response = await axios.get(`/api/messages`, {
        params: { product_id: product.id },
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      const loadedMessages = (response.data?.data || response.data || [])
      setMessages(Array.isArray(loadedMessages) ? loadedMessages : [])

      if (user.id === product.user_id) {
        const lastMessage = loadedMessages[loadedMessages.length - 1]
        if (lastMessage) {
          const otherUserId = lastMessage.sender_id === user.id ? lastMessage.receiver_id : lastMessage.sender_id
          const otherUserName = lastMessage.sender_id === user.id ? lastMessage.receiver_name : lastMessage.sender_name
          setChatReceiverId(otherUserId)
          setChatPartnerName(otherUserName || 'Buyer')
        } else {
          setChatReceiverId(null)
          setChatPartnerName('')
        }
      } else {
        setChatReceiverId(product.user_id)
        setChatPartnerName(product.seller || 'Seller')
      }

      const unreadExists = loadedMessages.some((msg) => msg.receiver_id === user.id && !msg.is_read)
      if (unreadExists) {
        await axios.put('/api/messages/read', {
          product_id: product.id
        }, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })

        setMessages((prevMessages) => prevMessages.map((msg) => {
          return msg.receiver_id === user.id ? { ...msg, is_read: true } : msg
        }))
      }
    } catch (error) {
      setChatError(error.response?.data?.error || 'Unable to load chat')
    } finally {
      setChatLoading(false)
    }
  }

  const handleChat = async () => {
    if (!user) {
      onOpenLogin()
      return
    }

    setChatError('')
    setChatOpen(true)
    await loadMessages()
    // Join product room for real-time updates
    try {
      socketRef.current?.emit('join', { productId: product.id })
    } catch (e) {}
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) {
      return
    }

    try {
      setChatError('')

      const payload = {
        product_id: product.id,
        message: chatMessage.trim()
      }

      if (user.id === product.user_id) {
        if (!chatReceiverId) {
          setChatError('Waiting for buyer messages before sending a reply.')
          return
        }
        payload.receiver_id = chatReceiverId
      }

      const response = await axios.post('/api/messages', payload, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      setMessages((prev) => {
        if (prev.some((existing) => existing.id === response.data.id)) {
          return prev
        }
        return [...prev, response.data]
      })
      setChatMessage('')

      if (user.id === product.user_id) {
        setChatReceiverId(response.data.receiver_id)
        setChatPartnerName(response.data.receiver_name || 'Buyer')
      }
    } catch (error) {
      setChatError(error.response?.data?.error || 'Unable to send message')
    }
  }

  const handleChatInputKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <>
        <Navbar user={user} onOpenLogin={onOpenLogin} />
        <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: '60vh' }}>
          <p>Loading product details...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar user={user} onOpenLogin={onOpenLogin} />
        <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: '60vh' }}>
          <h2>Product not found</h2>
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Back to Home
          </button>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar user={user} onOpenLogin={onOpenLogin} />
      <div style={{ minHeight: '80vh', backgroundColor: '#f9fafb', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              marginBottom: '20px',
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ← Back
          </button>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Product Image */}
            <div>
              <div style={{
                width: '100%',
                height: '420px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={`${product.title} image ${selectedImageIndex + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ fontSize: '80px' }}>📦</div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  {product.images.map((imageUrl, index) => (
                    <button
                      key={imageUrl + index}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      style={{
                        padding: 0,
                        border: selectedImageIndex === index ? '2px solid #0ea5e9' : '1px solid #d1d5db',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: 'none'
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={`${product.title} thumbnail ${index + 1}`}
                        style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: '#f0f9ff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #bfdbfe'
                }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>CONDITION</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#002f34' }}>
                    {product.condition}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f0fdf4',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>CATEGORY</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
                    {product.category}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#002f34' }}>
                {product.title}
              </h1>

              {/* Price */}
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#10b981',
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: '2px solid #f0f0f0'
              }}>
                ₹ {product.price?.toLocaleString('en-IN') || 0}
              </div>

              {/* Description */}
              {product.description && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                    About this product
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Info Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px',
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: '600' }}>
                    POSTED ON
                  </div>
                  <div style={{ fontSize: '14px', color: '#333' }}>
                    {new Date(product.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', fontWeight: '600' }}>
                    POSTED TIME
                  </div>
                  <div style={{ fontSize: '14px', color: '#333' }}>
                    {new Date(product.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Seller Information */}
              <div style={{
                backgroundColor: '#fef3c7',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #fde68a',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
                  📍 Seller Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>NAME</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                      {product.seller || 'Anonymous'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>COLLEGE</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                      {product.college || 'Not specified'}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>PHONE</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                    {product.sellerPhone || 'Not provided'}
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>EMAIL</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', wordBreak: 'break-all' }}>
                    {product.sellerEmail || 'Not provided'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <button
                  onClick={handleCall}
                  style={{
                    padding: '14px 20px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  <img src="/phone-icon.svg" alt="Call" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                  Call Owner
                </button>

                <button
                  onClick={handleChat}
                  style={{
                    padding: '14px 20px',
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0284c7'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#0ea5e9'}
                >
                  <img src="/envelope-icon.svg" alt="Chat" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                  Chat
                </button>

                <button
                  onClick={handleAddToFavorites}
                  style={{
                    padding: '14px 20px',
                    backgroundColor: isFavorite ? '#ef4444' : '#f3f4f6',
                    color: isFavorite ? 'white' : '#333',
                    border: isFavorite ? 'none' : '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isFavorite) e.target.style.backgroundColor = '#e5e7eb'
                  }}
                  onMouseLeave={(e) => {
                    if (!isFavorite) e.target.style.backgroundColor = '#f3f4f6'
                  }}
                >
                  <img 
                    src="/heart-icon.svg" 
                    alt="Like" 
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      filter: isFavorite ? 'brightness(0) invert(1)' : 'none'
                    }} 
                  />
                  {isFavorite ? 'Liked' : 'Like'}
                </button>

                {user && user.id === product.user_id && !product.sold && (
                  <button
                    onClick={handleMarkSold}
                    disabled={markingSold}
                    style={{
                      padding: '14px 20px',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: markingSold ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: markingSold ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!markingSold) e.target.style.backgroundColor = '#7c3aed'
                    }}
                    onMouseLeave={(e) => {
                      if (!markingSold) e.target.style.backgroundColor = '#8b5cf6'
                    }}
                  >
                    {markingSold ? '⏳ Marking...' : '✓ Mark Sold'}
                  </button>
                )}
              </div>

              {/* Chat Panel */}
              {chatOpen && (
                <div style={{
                  marginBottom: '24px',
                  padding: '20px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                        {user.id === product.user_id ? `Conversation with ${chatPartnerName || 'Buyer'}` : 'Chat with Seller'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#475569' }}>
                        {user.id === product.user_id ? `Product owner • ${product.sellerEmail}` : `${product.seller} • ${product.sellerEmail}`}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        try { socketRef.current?.emit('leave', { productId: product.id }) } catch (e) {}
                        setChatOpen(false)
                      }}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <div style={{
                    maxHeight: '320px',
                    overflowY: 'auto',
                    marginBottom: '16px',
                    padding: '12px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {chatLoading ? (
                      <div style={{ color: '#64748b' }}>Loading chat...</div>
                    ) : messages.length === 0 ? (
                      <div style={{ color: '#64748b' }}>No messages yet. Start the conversation.</div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          style={{
                            marginBottom: '14px',
                            textAlign: msg.sender_id === user.id ? 'right' : 'left'
                          }}
                        >
                          <div style={{
                            display: 'inline-block',
                            padding: '12px',
                            borderRadius: '18px',
                            backgroundColor: msg.sender_id === user.id ? '#0ea5e9' : '#e2e8f0',
                            color: msg.sender_id === user.id ? 'white' : '#0f172a',
                            maxWidth: '80%'
                          }}>
                            {msg.message}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                            {new Date(msg.created_at).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {chatError && (
                    <div style={{ color: '#b91c1c', marginBottom: '12px' }}>
                      {chatError}
                    </div>
                  )}

                  {user.id === product.user_id && !chatReceiverId && (
                    <div style={{ color: '#475569', marginBottom: '12px' }}>
                      Waiting for a buyer to start the conversation. You can reply once the buyer sends the first message.
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={handleChatInputKeyDown}
                      placeholder={user.id === product.user_id && !chatReceiverId ? 'Waiting for buyer to start chat...' : 'Type your message...'}
                      disabled={user.id === product.user_id && !chatReceiverId}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        fontSize: '14px',
                        backgroundColor: user.id === product.user_id && !chatReceiverId ? '#f1f5f9' : 'white',
                        color: user.id === product.user_id && !chatReceiverId ? '#94a3b8' : '#0f172a'
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={user.id === product.user_id && !chatReceiverId}
                      style={{
                        padding: '12px 18px',
                        backgroundColor: user.id === product.user_id && !chatReceiverId ? '#94a3b8' : '#0ea5e9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: user.id === product.user_id && !chatReceiverId ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div style={{
                padding: '16px',
                backgroundColor: '#ecfdf5',
                borderRadius: '8px',
                border: '1px solid #d1fae5',
                fontSize: '13px',
                color: '#065f46'
              }}>
                <p style={{ margin: 0 }}>
                  ✓ Please verify the product condition before making payment<br/>
                  ✓ Meet the seller in a safe public location<br/>
                  ✓ Check all details carefully before finalizing the deal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
