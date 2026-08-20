import React, { useEffect, useState, useRef } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { adminAuthAPI, adminReportsAPI } from '../../services/adminApi'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [admin, setAdmin] = useState(null)
  const [pendingReportsCount, setPendingReportsCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchPendingReportsRef = useRef()

  useEffect(() => {
    fetchPendingReportsRef.current = async () => {
      try {
        const res = await adminReportsAPI.getAll({ status: 'pending', limit: 1 })
        setPendingReportsCount(res.data.pagination.total || 0)
      } catch (e) {
        console.error('Failed to fetch pending reports count', e)
      }
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const savedAdmin = localStorage.getItem('adminUser')

    if (!token || !savedAdmin) {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      navigate('/admin/login')
      return
    }

    setAdmin(JSON.parse(savedAdmin))
    setLoading(false)

    if (fetchPendingReportsRef.current) {
      fetchPendingReportsRef.current()
    }

    const interval = setInterval(() => {
      if (fetchPendingReportsRef.current) {
        fetchPendingReportsRef.current()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-gradient)', backgroundAttachment: 'fixed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-teal-400 mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>Securing Admin Portal...</span>
        </div>
      </div>
    )
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
    )},
    { path: '/admin/analytics', label: 'Analytics', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2" /></svg>
    )},
    { path: '/admin/users', label: 'Users', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    )},
    { path: '/admin/products', label: 'Products', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    )},
    { path: '/admin/categories', label: 'Categories', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
    )},
    { path: '/admin/reports', label: 'Reports', badge: pendingReportsCount, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    )},
    { path: '/admin/transactions', label: 'Transactions', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { path: '/admin/offers', label: 'Offers', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4" /></svg>
    )},
    { path: '/admin/messages', label: 'Messages', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    )},
    { path: '/admin/reviews', label: 'Reviews', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" /></svg>
    )},
    { path: '/admin/colleges', label: 'Colleges', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    )},
    { path: '/admin/coins', label: 'Coins System', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { path: '/admin/announcements', label: 'Announcements', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
    )},
    { path: '/admin/settings', label: 'Site Settings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { path: '/admin/access-control', label: 'Access Control', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    )}
  ]

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'super_admin': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
      case 'moderator': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
      default: return 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin'
      case 'moderator': return 'Moderator'
      default: return 'Support'
    }
  }

  return (
    <div className="min-h-screen flex font-sans" style={{ background: 'var(--bg-gradient)', backgroundAttachment: 'fixed', color: 'var(--text-primary)' }}>
      {}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 sticky top-0 h-screen select-none z-30" style={{ background: 'var(--navbar-bg)', borderRight: '1px solid var(--border-color)' }}>
        <div className="p-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <Link to="/admin" className="flex items-center space-x-2 group">
            <img
              src="/collegemart_logo.png"
              alt="CollegeMart Logo"
              className="w-9 h-9 object-contain transition-all duration-300 group-hover:scale-110"
              style={{ filter: 'drop-shadow(0 1px 4px rgba(35,229,219,0.4))' }}
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider leading-none transition-all duration-300 group-hover:tracking-widest">
                <span style={{ color: 'var(--text-primary)' }}>College</span><span className="text-teal-400 group-hover:text-teal-300">Mart</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-teal-500 mt-1 group-hover:text-teal-300 transition-colors duration-300">Admin Portal</span>
            </div>
          </Link>
        </div>

        {}
        {admin && (
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.04)' }}>
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{admin.name}</p>
            <p className="text-xs truncate mb-2" style={{ color: 'var(--text-muted)' }}>{admin.email}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${getRoleBadgeClass(admin.role)}`}>
              {getRoleLabel(admin.role)}
            </span>
          </div>
        )}

        {}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-400 border-l-4 border-teal-500 pl-2'
                    : 'hover:bg-black/5'
                }`}
                style={!isActive ? { color: 'var(--text-muted)' } : {}}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {}
        <div className="p-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="fixed top-0 bottom-0 left-0 w-64 flex flex-col z-50 animate-slide-in" style={{ background: 'var(--navbar-bg)', borderRight: '1px solid var(--border-color)' }}>
            <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <Link to="/admin" className="flex items-center space-x-2 group" onClick={() => setMobileMenuOpen(false)}>
                <img
                  src="/collegemart_logo.png"
                  alt="CollegeMart Logo"
                  className="w-9 h-9 object-contain transition-all duration-300 group-hover:scale-110"
                  style={{ filter: 'drop-shadow(0 1px 4px rgba(35,229,219,0.4))' }}
                />
                <span className="font-bold text-lg tracking-wider leading-none">
                  <span style={{ color: 'var(--text-primary)' }}>College</span><span className="text-teal-400 group-hover:text-teal-300 transition-colors duration-300">Mart</span>
                </span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {admin && (
              <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.04)' }}>
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{admin.name}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold inline-block mt-1 ${getRoleBadgeClass(admin.role)}`}>
                  {getRoleLabel(admin.role)}
                </span>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-teal-500/15 text-teal-400 border-l-4 border-teal-500 pl-2'
                        : 'hover:bg-black/5'
                    }`}
                    style={!isActive ? { color: 'var(--text-muted)' } : {}}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="p-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {}
        <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm" style={{ background: 'var(--navbar-bg)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="focus:outline-none lg:hidden" style={{ color: 'var(--text-muted)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="hidden sm:flex items-center text-xs text-slate-400 font-medium tracking-wide">
              <span style={{ color: 'var(--text-muted)' }}>ADMIN</span>
              <span className="mx-2" style={{ color: 'var(--border-color)' }}>/</span>
              <span className="capitalize font-semibold" style={{ color: 'var(--text-primary)' }}>
                {location.pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center space-x-1 px-3 py-1.5 rounded border transition-all font-medium"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <span>View Main Site</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>

            {}
            <div className="flex items-center space-x-2.5 pl-3" style={{ borderLeft: '1px solid var(--border-color)' }}>
              <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm select-none shadow-md">
                {admin?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="hidden md:inline text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{admin?.name}</span>
            </div>
          </div>
        </header>

        {}
        <main className="flex-1 p-6 overflow-y-auto scrollbar-thin" style={{ background: 'transparent' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
