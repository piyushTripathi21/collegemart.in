import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'
import { useThemeStyles } from '../context/useThemeStyles'


export default function ChatPage({ user, onOpenLogin }) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return
      setLoading(true)
      setError('')

      try {
        const response = await axios.get('/api/messages/conversations', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        setConversations(response.data || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load conversations')
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [user])

  const openConversation = (productId) => {
    navigate(`/product/${productId}`)
  }

  const t = useThemeStyles()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!user) {
    return (
      <>
        <Navbar user={user} onOpenLogin={onOpenLogin} />
        <div style={{
          minHeight: '80vh',
          background: 'var(--bg-gradient)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px'
        }}>
          {/* Subtle decorative blobs */}
          <div style={{
            position: 'absolute', top: '10%', right: '-150px',
            width: '450px', height: '450px', borderRadius: '50%',
            background: isDark ? 'rgba(35,229,219,0.03)' : 'rgba(14,165,233,0.05)',
            pointerEvents: 'none',
            filter: 'blur(90px)',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', left: '-150px',
            width: '450px', height: '450px', borderRadius: '50%',
            background: isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.05)',
            pointerEvents: 'none',
            filter: 'blur(90px)',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', color: t.textPrimary, marginBottom: '20px' }}>Please log in to view your chats</h2>
            <button
              onClick={onOpenLogin}
              style={{
                padding: '12px 28px',
                backgroundColor: t.btnPrimary,
                color: t.btnPrimaryText,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'opacity 0.2s',
                boxShadow: t.cardShadow
              }}
              onMouseEnter={e => e.target.style.opacity = '0.9'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Login
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar user={user} onOpenLogin={onOpenLogin} />
      <div style={{
        minHeight: '80vh',
        background: 'var(--bg-gradient)',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 20px'
      }}>
        {/* Subtle decorative blobs across the chat page */}
        <div style={{
          position: 'absolute', top: '50px', right: '-150px',
          width: '450px', height: '450px', borderRadius: '50%',
          background: isDark ? 'rgba(35,229,219,0.03)' : 'rgba(14,165,233,0.05)',
          pointerEvents: 'none',
          filter: 'blur(90px)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '50px', left: '-150px',
          width: '450px', height: '450px', borderRadius: '50%',
          background: isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.05)',
          pointerEvents: 'none',
          filter: 'blur(90px)',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', color: t.textPrimary, marginBottom: '12px', fontWeight: '700' }}>My Chats</h1>
            <p style={{ fontSize: '16px', color: t.textMuted, maxWidth: '720px' }}>
              View your ongoing conversations and continue chatting with buyers or sellers.
            </p>
          </div>

          {loading ? (
            <div style={{ color: t.textMuted, fontSize: '16px' }}>Loading conversations...</div>
          ) : error ? (
            <div style={{ color: '#ef4444', fontSize: '16px' }}>{error}</div>
          ) : conversations.length === 0 ? (
            <div style={{
              backgroundColor: t.cardBg,
              padding: '40px 30px',
              borderRadius: '16px',
              border: `1px solid ${t.borderColor}`,
              boxShadow: t.cardShadow,
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: '22px', color: t.textPrimary, marginBottom: '12px' }}>No conversations yet</h2>
              <p style={{ fontSize: '15px', color: t.textMuted }}>
                Start a chat from any product page by tapping the chat button.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '18px' }}>
              {conversations.map((conversation) => (
                <div
                  key={`${conversation.product_id}-${conversation.partner_id}`}
                  style={{
                    backgroundColor: t.cardBg,
                    borderRadius: '16px',
                    padding: '22px',
                    border: `1px solid ${t.borderColor}`,
                    boxShadow: t.cardShadow,
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '20px',
                    alignItems: 'center',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = t.cardShadowHover
                    e.currentTarget.style.borderColor = t.accent
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = t.cardShadow
                    e.currentTarget.style.borderColor = t.borderColor
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', color: t.textMuted, marginBottom: '6px' }}>
                      {conversation.partner_name || 'Chat partner'} • {conversation.partner_email}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: t.textPrimary, marginBottom: '12px' }}>
                      {conversation.product_title || 'Product conversation'}
                    </div>
                    <div style={{ fontSize: '15px', color: t.textMuted, lineHeight: '1.7' }}>
                      {conversation.last_message || 'No message preview available.'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: t.textMuted, marginBottom: '10px' }}>
                      {new Date(conversation.last_message_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {conversation.unread_count > 0 && (
                      <div style={{
                        display: 'inline-block',
                        backgroundColor: '#f97316',
                        color: 'white',
                        borderRadius: '999px',
                        padding: '6px 12px',
                        fontSize: '13px',
                        marginBottom: '10px'
                      }}>
                        {conversation.unread_count} unread
                      </div>
                    )}
                    <button
                      onClick={() => openConversation(conversation.product_id)}
                      style={{
                        width: '100%',
                        marginTop: '12px',
                        padding: '12px 18px',
                        backgroundColor: t.btnPrimary,
                        color: t.btnPrimaryText,
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'opacity 0.2s, transform 0.2s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.opacity = '0.9'
                        e.currentTarget.style.transform = 'scale(1.02)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.opacity = '1'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      Open chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
