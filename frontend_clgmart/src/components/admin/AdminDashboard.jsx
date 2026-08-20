import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminDashboardAPI } from '../../services/adminApi'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [charts, setCharts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsRes, chartsRes] = await Promise.all([
          adminDashboardAPI.getStats(),
          adminDashboardAPI.getCharts()
        ])
        setStats(statsRes.data)
        setCharts(chartsRes.data)
      } catch (err) {
        console.error('Failed to load dashboard data', err)
        setError(err.message || 'Error fetching dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" style={{ color: "var(--text-muted)" }}>
        <svg className="animate-spin h-8 w-8 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Loading stats dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm flex items-center space-x-2">
        <span>{error}</span>
      </div>
    )
  }

  const generateLinePath = (data, width = 500, height = 150) => {
    if (!data || data.length === 0) return ''
    const maxVal = Math.max(...data.map(d => d.count), 5)
    const stepX = width / (data.length - 1 || 1)
    
    return data.map((d, i) => {
      const x = i * stepX
      const y = height - (d.count / maxVal) * (height - 20) - 10
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  const generateAreaPath = (data, width = 500, height = 150) => {
    if (!data || data.length === 0) return ''
    const linePath = generateLinePath(data, width, height)
    return `${linePath} L ${width} ${height} L 0 ${height} Z`
  }

  const chartBgStyle = {
    background: 'var(--bg-gradient)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '8px',
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Dashboard Overview</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Welcome to CollegeMart administration dashboard console.</p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {}
        <div className="p-5 rounded-xl border transition-all shadow-sm group hover:border-teal-500/30" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Users</p>
              <h3 className="text-3xl font-extrabold mt-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>{stats?.total_users}</h3>
            </div>
            <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
              +{stats?.new_users_today} today
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span className="font-medium" style={{ color: 'var(--text-muted)' }}>+{stats?.new_users_week} this week</span>
          </div>
        </div>

        {}
        <div className="p-5 rounded-xl border transition-all shadow-sm group hover:border-teal-500/30" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Products Listed</p>
              <h3 className="text-3xl font-extrabold mt-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>{stats?.total_products}</h3>
            </div>
            <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center text-teal-600 dark:text-teal-400">
              <span className="w-2 h-2 rounded-full bg-teal-500 mr-1.5 animate-pulse" />
              {stats?.active_products} Active
            </span>
            <span>{stats?.sold_products} Sold</span>
            <span>+{stats?.new_listings_today} today</span>
          </div>
        </div>

        {}
        <div className="p-5 rounded-xl border transition-all shadow-sm group hover:border-teal-500/30" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Platform Revenue</p>
              <h3 className="text-3xl font-extrabold mt-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>₹{Number(stats?.total_revenue).toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{stats?.total_transactions} Transactions</span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Completed status only</span>
          </div>
        </div>

        {}
        <div className="p-5 rounded-xl border transition-all shadow-sm group hover:border-teal-500/30" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Moderation queue</p>
              <h3 className="text-3xl font-extrabold mt-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>{stats?.pending_reports}</h3>
            </div>
            <div className={`p-3 rounded-lg group-hover:scale-105 transition-transform duration-300 ${
              stats?.pending_reports > 0 ? 'bg-rose-500/15 text-rose-500 dark:text-rose-400 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
          </div>
          <div className="mt-4 text-xs">
            {stats?.pending_reports > 0 ? (
              <Link to="/admin/reports" className="text-rose-600 dark:text-rose-400 hover:text-rose-500 font-semibold flex items-center space-x-1">
                <span>Action required! Go to reports</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            ) : (
              <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Reports queue is clean</span>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="p-5 rounded-xl border flex flex-wrap gap-6 items-center justify-around" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Total Chat Messages</p>
          <p className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stats?.total_messages}</p>
        </div>
        <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: 'var(--border-color)' }} />
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Total Seller Reviews</p>
          <p className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stats?.total_reviews}</p>
        </div>
        <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: 'var(--border-color)' }} />
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Banned Accounts</p>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">{stats?.banned_users}</p>
        </div>
        <div className="w-px h-8 hidden sm:block" style={{ backgroundColor: 'var(--border-color)' }} />
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Active Coin Pool</p>
          <p className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>🪙 {stats?.total_users ? (stats.total_users * 15).toLocaleString() : 0}</p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className="p-5 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>User Signup Growth (30 days)</h4>
          {charts?.userGrowth?.length > 1 ? (
            <div className="relative">
              <div style={chartBgStyle}>
                <svg className="w-full h-36 text-teal-400" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={generateAreaPath(charts.userGrowth, 500, 150)} fill="url(#userGrad)" />
                  <path d={generateLinePath(charts.userGrowth, 500, 150)} fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                <span>{new Date(charts.userGrowth[0].date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                <span>{new Date(charts.userGrowth[Math.floor(charts.userGrowth.length/2)].date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                <span>{new Date(charts.userGrowth[charts.userGrowth.length - 1].date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
              </div>
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-xs font-mono rounded-lg border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              Insufficient growth data points
            </div>
          )}
        </div>

        {}
        <div className="p-5 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>Product Listing Activity (30 days)</h4>
          {charts?.productGrowth?.length > 1 ? (
            <div className="relative">
              <div style={chartBgStyle}>
                <svg className="w-full h-36 text-sky-400" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={generateAreaPath(charts.productGrowth, 500, 150)} fill="url(#prodGrad)" />
                  <path d={generateLinePath(charts.productGrowth, 500, 150)} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                <span>{new Date(charts.productGrowth[0].date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                <span>{new Date(charts.productGrowth[Math.floor(charts.productGrowth.length/2)].date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                <span>{new Date(charts.productGrowth[charts.productGrowth.length - 1].date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
              </div>
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-xs font-mono rounded-lg border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              Insufficient listings data points
            </div>
          )}
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className="p-5 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>Active Colleges</h4>
          {stats?.topColleges?.length > 0 ? (
            <div className="space-y-3.5">
              {stats.topColleges.map((college, i) => (
                <div key={college.college} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold w-5 h-5 rounded flex items-center justify-center border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-[350px]" style={{ color: 'var(--text-primary)' }}>
                      {college.college}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    {college.count} users
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs py-4 font-mono text-center" style={{ color: 'var(--text-muted)' }}>No college statistics available.</p>
          )}
        </div>

        {}
        <div className="p-5 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>Top Categories</h4>
          {stats?.topCategories?.length > 0 ? (
            <div className="space-y-3.5">
              {stats.topCategories.map((category, i) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold w-5 h-5 rounded flex items-center justify-center border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                      {category.category || 'Uncategorized'}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded">
                    {category.count} listings
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs py-4 font-mono text-center" style={{ color: 'var(--text-muted)' }}>No category statistics available.</p>
          )}
        </div>
      </div>
    </div>
  )
}
