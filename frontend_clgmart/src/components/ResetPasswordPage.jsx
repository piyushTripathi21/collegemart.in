import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'
import Navbar from './Navbar'
import Footer from './Footer'
import { useToast } from '../context/ToastContext'

export default function ResetPasswordPage({ user, onOpenLogin }) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const token = window.location.pathname.split('/reset-password/')[1] || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 8) {
      showToast('Password must be at least 8 characters', 'error')
      return
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(`/api/users/reset-password/${token}`, { password })
      showToast(response.data.message || 'Password reset successful!', 'success')
      setDone(true)
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to reset password. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-gradient)' }}>
      <Navbar user={user} onOpenLogin={onOpenLogin} />
      <div style={{
        maxWidth: '440px',
        margin: '80px auto',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
          <img 
            src="/lock-icon-black.png" 
            alt="Reset Password" 
            style={{ width: '64px', height: '64px', marginBottom: '12px' }} 
          />
          <h2 style={{ margin: 0, fontSize: '24px', color: '#1e293b', textAlign: 'center' }}>
            Reset Password
          </h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
          Enter your new password below.
        </p>

        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ color: '#10b981', margin: '0 0 8px 0' }}>Password Reset!</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              Your password has been updated. You can now log in with your new password.
            </p>
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
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password (min 8 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  )
}
