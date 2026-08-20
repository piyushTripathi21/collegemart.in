import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../services/api'
import Navbar from './Navbar'
import Footer from './Footer'

export default function VerifyEmailPage({ user, onOpenLogin }) {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.get(`/api/users/verify-email/${token}`)
        setStatus('success')
        setMessage(response.data.message || 'Email verified successfully!')
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.error || 'Verification failed. The link may be invalid or expired.')
      }
    }
    if (token) verify()
  }, [token])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-gradient)' }}>
      <Navbar user={user} onOpenLogin={onOpenLogin} />
      <div style={{
        maxWidth: '480px',
        margin: '80px auto',
        padding: '48px 40px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}>
        {status === 'verifying' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h2 style={{ color: '#1e293b', margin: '0 0 8px 0' }}>Verifying your email...</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: '#10b981', margin: '0 0 8px 0' }}>Email Verified!</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>{message}</p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Go to Home Page
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h2 style={{ color: '#ef4444', margin: '0 0 8px 0' }}>Verification Failed</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>{message}</p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Go to Home Page
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
