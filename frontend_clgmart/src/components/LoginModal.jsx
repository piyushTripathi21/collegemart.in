import React, { useState } from 'react'
import axios from '../services/api'
import { GoogleLogin } from '@react-oauth/google'
import { useToast } from '../context/ToastContext'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function LoginModal({ onClose, onLogin }) {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [college, setCollege] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const fetchSuggestions = async (val) => {
    if (val.trim()) {
      try {
        const response = await axios.get('/api/colleges/suggest', { params: { q: val } })
        setSuggestions(response.data)
        setShowDropdown(true)
        setSelectedIndex(-1)
      } catch (err) {
        console.error(err)
      }
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }
  }

  const handleCollegeChange = (e) => {
    const val = e.target.value
    setCollege(val)
    fetchSuggestions(val)
  }

  const handleKeyDown = (e) => {
    if (!showDropdown) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault()
          setCollege(suggestions[selectedIndex].name)
          setShowDropdown(false)
        }
        break
      case 'Escape':
        setShowDropdown(false)
        break
      default:
        break
    }
  }

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  const [showOtpScreen, setShowOtpScreen] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (!acceptedTerms) {
          setError('You must accept the Terms of Use and Privacy Policy')
          setLoading(false)
          return
        }
        const response = await axios.post('/api/users/register', {
          email,
          password,
          name,
          college,
          acceptedTerms: true
        })
        const { email: registeredMail, message } = response.data
        setRegisteredEmail(registeredMail || email)
        showToast(message || 'OTP sent to your email!', 'success')
        setShowOtpScreen(true)
      } else {
        const response = await axios.post('/api/users/login', {
          email,
          password
        })
        const { user, token } = response.data
        const userData = { ...user, token }
        localStorage.setItem('user', JSON.stringify(userData))
        onLogin(userData)
        showToast('Logged in successfully!', 'success')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async (e) => {
    e.preventDefault()
    setError('')
    setOtpLoading(true)
    try {
      const response = await axios.post('/api/users/verify-otp', {
        email: registeredEmail || email,
        otp
      })
      const { user, token, message } = response.data
      const userData = { ...user, token }
      localStorage.setItem('user', JSON.stringify(userData))
      onLogin(userData)
      showToast(message || 'Account verified successfully!', 'success')
      setEmail('')
      setPassword('')
      setName('')
      setCollege('')
      setOtp('')
      setShowOtpScreen(false)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Verification failed')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError('')
    setResendLoading(true)
    try {
      const response = await axios.post('/api/users/resend-otp', {
        email: registeredEmail || email
      })
      showToast(response.data.message || 'New OTP sent to email!', 'success')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Resend failed')
    } finally {
      setResendLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)
    try {
      const response = await axios.post('/api/users/google-login', {
        token: credentialResponse.credential
      })
      const { user, token } = response.data
      const userData = { ...user, token }
      localStorage.setItem('user', JSON.stringify(userData))
      onLogin(userData)
      showToast('Logged in with Google successfully!', 'success')
    } catch (err) {
      setError(err.response?.data?.error || 'Google login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.')
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotLoading(true)
    setError('')
    try {
      const response = await axios.post('/api/users/forgot-password', { email: forgotEmail })
      setForgotSent(true)
      showToast(response.data.message || 'Reset email sent!', 'success')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to send reset email')
    } finally {
      setForgotLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000
      }}>
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '40px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
            <img 
              src="/forgot-password-icon.png" 
              alt="Forgot Password" 
              style={{ width: '64px', height: '64px', marginBottom: '12px' }} 
            />
            <h2 id="forgot-password-title" style={{ marginTop: 0, marginBottom: 0, textAlign: 'center' }}>
              Forgot Password
            </h2>
          </div>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            Enter your email and we'll send you a link to reset your password.
          </p>

          {forgotSent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <img 
                  src="/envelope-icon-black.png" 
                  alt="Email Sent" 
                  style={{ width: '64px', height: '64px' }} 
                />
              </div>
              <p style={{ color: '#10b981', fontWeight: '600', fontSize: '16px', marginBottom: '8px' }}>
                Check your email!
              </p>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                If an account exists with that email, we've sent a password reset link.
              </p>
              <button
                onClick={() => { setShowForgotPassword(false); setForgotSent(false) }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Your email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
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

              <button
                type="submit"
                disabled={forgotLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: forgotLoading ? 'not-allowed' : 'pointer',
                  opacity: forgotLoading ? 0.6 : 1,
                  marginBottom: '12px'
                }}
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => { setShowForgotPassword(false); setError('') }}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  if (showOtpScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000
      }}>
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="otp-verification-title"
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '40px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
            <img 
              src="/envelope-icon-blue.png" 
              alt="Email Verification" 
              style={{ width: '64px', height: '64px', marginBottom: '12px' }} 
            />
            <h2 id="otp-verification-title" style={{ marginTop: 0, marginBottom: 0, textAlign: 'center' }}>
              Verify Your Email
            </h2>
          </div>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            We've sent a 6-digit OTP code to <strong>{registeredEmail || email}</strong>. Please enter it below.
          </p>

          <form onSubmit={handleOtpVerify}>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '18px',
                fontWeight: 'bold',
                letterSpacing: '8px',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
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

            <button
              type="submit"
              disabled={otpLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: otpLoading ? 'not-allowed' : 'pointer',
                opacity: otpLoading ? 0.6 : 1,
                marginBottom: '12px'
              }}
            >
              {otpLoading ? 'Verifying...' : 'Verify & Sign Up'}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                border: '1px solid #bbf7d0',
                borderRadius: '4px',
                cursor: resendLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                marginBottom: '12px'
              }}
            >
              {resendLoading ? 'Sending new code...' : 'Resend OTP Code'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowOtpScreen(false)
                setError('')
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#f0f0f0',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Back to Registration
            </button>
          </form>
        </div>
      </div>
    )
  }

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
      zIndex: 10000
    }}>
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="main-modal-title"
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '40px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h2 id="main-modal-title" style={{ marginTop: 0, marginBottom: '30px', textAlign: 'center' }}>
            {isSignUp ? 'Create Account' : 'Login'}
          </h2>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  placeholder="Your College"
                  value={college}
                  onChange={handleCollegeChange}
                  onFocus={() => {
                    if (college.trim()) {
                      fetchSuggestions(college)
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 200)
                  }}
                  onKeyDown={handleKeyDown}
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
                {showDropdown && suggestions.length > 0 && (
                  <div 
                    role="listbox"
                    aria-label="College suggestions"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% - 12px)',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderTop: 'none',
                      borderRadius: '0 0 4px 4px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 10001
                    }}
                  >
                    {suggestions.map((c, index) => (
                      <div
                        key={index}
                        role="option"
                        aria-selected={selectedIndex === index}
                        onMouseDown={() => {
                          setCollege(c.name)
                          setShowDropdown(false)
                        }}
                        style={{
                          padding: '10px 12px',
                          cursor: 'pointer',
                          backgroundColor: selectedIndex === index ? '#f0f0f0' : 'white',
                          borderBottom: '1px solid #eee',
                          fontSize: '13px',
                          textAlign: 'left'
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div style={{ fontWeight: '600', color: '#002f34' }}>{c.short}</div>
                        <div style={{ fontSize: '11px', color: '#666' }}>{c.name} • {c.state}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <input
            type="email"
            placeholder="College Email (e.g., name@college.edu)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: isSignUp ? '12px' : '6px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            required
          />

          {}
          {!isSignUp && (
            <div style={{ textAlign: 'right', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => { setShowForgotPassword(true); setError('') }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0ea5e9',
                  cursor: 'pointer',
                  fontSize: '13px',
                  padding: 0
                }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {}
          {isSignUp && (
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginBottom: '12px',
              fontSize: '13px',
              color: '#475569',
              cursor: 'pointer',
              lineHeight: '1.4'
            }}>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{ marginTop: '2px', flexShrink: 0 }}
              />
              <span>
                I agree to the{' '}
                <a href="/terms-of-use" target="_blank" style={{ color: '#0ea5e9', textDecoration: 'underline' }}>
                  Terms of Use
                </a>{' '}
                and{' '}
                <a href="/privacy-policy" target="_blank" style={{ color: '#0ea5e9', textDecoration: 'underline' }}>
                  Privacy Policy
                </a>
              </span>
            </label>
          )}

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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginBottom: '12px'
            }}
          >
            {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>

          {!isSignUp && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <hr style={{ flex: 1, margin: 0 }} />
                <span style={{ padding: '0 10px', color: '#666', fontSize: '12px' }}>OR</span>
                <hr style={{ flex: 1, margin: 0 }} />
              </div>
              {GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== '' ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                  />
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#fef3cd',
                  border: '1px solid #ffc107',
                  color: '#856404',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: '0 0 8px 0' }}>⚙️ Google Login Setup Required</p>
                  <p style={{ margin: 0, fontSize: '12px' }}>
                    See <strong>GOOGLE_OAUTH_SETUP.md</strong> for configuration instructions
                  </p>
                </div>
              )}
            </div>
          )}
        </form>

        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0ea5e9',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isSignUp ? 'Already have an account? Login' : 'New here? Sign Up'}
          </button>
        </div>

        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#f0f0f0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
