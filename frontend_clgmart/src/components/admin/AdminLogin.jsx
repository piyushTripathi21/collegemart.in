import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAuthAPI } from '../../services/adminApi'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    const token = localStorage.getItem('adminToken')
    if (token) {
      navigate('/admin')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await adminAuthAPI.login(email, password)
      const { token, admin } = res.data
      
      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminUser', JSON.stringify(admin))
      
      navigate('/admin')
    } catch (err) {
      console.error('[ADMIN LOGIN ERROR]', err)
      setError(err.message || 'Invalid credentials or connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden font-sans select-none" style={{ background: 'var(--bg-gradient)' }}>
      {}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {}
      <div className="w-full max-w-md backdrop-blur-md border rounded-2xl shadow-2xl p-8 z-10 animate-fade-in" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="flex flex-col items-center mb-8">
          <img
            src="/collegemart_logo.png"
            alt="CollegeMart Logo"
            className="w-16 h-16 object-contain mb-3"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(35,229,219,0.45))' }}
          />
          <h1 className="text-2xl font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>CollegeMart Admin</h1>
          <p className="text-xs mt-1 uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }} htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full focus:border-teal-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
              placeholder="admin@collegemart.com"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }} htmlFor="password">
                Password
              </label>
            </div>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full focus:border-teal-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
              placeholder="••••••••"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2 text-sm mt-8"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          <p>© {new Date().getFullYear()} CollegeMart Inc.</p>
          <p className="mt-1">All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
