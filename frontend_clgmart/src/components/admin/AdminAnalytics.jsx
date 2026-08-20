import React, { useState, useEffect } from 'react'
import { adminAnalyticsAPI } from '../../services/adminApi'

export default function AdminAnalytics() {
  const [days, setDays] = useState(30)
  const [usersData, setUsersData] = useState([])
  const [productsData, setProductsData] = useState({ newListings: [], soldListings: [] })
  const [categoriesData, setCategoriesData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [uRes, pRes, cRes, rRes] = await Promise.all([
        adminAnalyticsAPI.getUsers(days),
        adminAnalyticsAPI.getProducts(days),
        adminAnalyticsAPI.getCategories(),
        adminAnalyticsAPI.getRevenue(days)
      ])
      setUsersData(uRes.data)
      setProductsData(pRes.data)
      setCategoriesData(cRes.data)
      setRevenueData(rRes.data)
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics reporting')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const handleExportCSV = async () => {
    try {
      setExporting(true)
      await adminAnalyticsAPI.exportCSV()
    } catch (err) {
      alert('CSV Export failed: ' + err.message)
    } finally {
      setExporting(false)
    }
  }

  const drawLineGraph = (data, valueKey, width = 500, height = 150, strokeColor = '#14b8a6') => {
    if (!data || data.length === 0) return null
    const vals = data.map(d => Number(d[valueKey]) || 0)
    const maxVal = Math.max(...vals, 5)
    const stepX = width / (data.length - 1 || 1)

    const points = data.map((d, i) => {
      const x = i * stepX
      const y = height - ((Number(d[valueKey]) || 0) / maxVal) * (height - 30) - 15
      return { x, y }
    })

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#grad-${valueKey})`} />
        <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.length <= 15 && points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--card-bg)" stroke={strokeColor} strokeWidth="2" />
        ))}
      </svg>
    )
  }

  const cardStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '20px',
  }

  const chartBgStyle = {
    background: 'var(--bg-gradient)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '8px',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>System Analytics</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Analyze user conversion growth, listing statistics, and system cashflow metrics.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-teal-500"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <button
            disabled={exporting}
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 font-bold rounded-lg text-xs transition-colors flex items-center space-x-2 shadow-md shadow-teal-500/10"
            style={{ color: 'var(--sell-btn-color)' }}
          >
            {exporting ? (
              <span>Exporting...</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span>Export CSV Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
          Generating analytical tables...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <div style={cardStyle} className="space-y-4">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>User Signup Growth</h4>
                <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Daily student registrations logged on campus</p>
              </div>
              <div className="h-44 relative" style={chartBgStyle}>
                {usersData.length > 1 ? (
                  drawLineGraph(usersData, 'count', 500, 150, '#14b8a6')
                ) : (
                  <div className="h-full flex items-center justify-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>No data points.</div>
                )}
              </div>
              {usersData.length > 0 && (
                <div className="flex justify-between text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  <span>Start: {new Date(usersData[0].date).toLocaleDateString()}</span>
                  <span>End: {new Date(usersData[usersData.length - 1].date).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Platform Revenue */}
            <div style={cardStyle} className="space-y-4">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Marketplace Cashflow Volume</h4>
                <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Daily transaction earnings (INR volume)</p>
              </div>
              <div className="h-44 relative" style={chartBgStyle}>
                {revenueData.length > 1 ? (
                  drawLineGraph(revenueData, 'revenue', 500, 150, '#10b981')
                ) : (
                  <div className="h-full flex items-center justify-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>No sales events recorded.</div>
                )}
              </div>
              {revenueData.length > 0 && (
                <div className="flex justify-between text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  <span>Start: {new Date(revenueData[0].date).toLocaleDateString()}</span>
                  <span>End: {new Date(revenueData[revenueData.length - 1].date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Listing growth */}
            <div style={cardStyle} className="space-y-4">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>New Product Listings</h4>
                <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Daily uploaded merchandise counts</p>
              </div>
              <div className="h-44 relative" style={chartBgStyle}>
                {productsData.newListings?.length > 1 ? (
                  drawLineGraph(productsData.newListings, 'count', 500, 150, '#38bdf8')
                ) : (
                  <div className="h-full flex items-center justify-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>No listings.</div>
                )}
              </div>
              {productsData.newListings?.length > 0 && (
                <div className="flex justify-between text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  <span>Start: {new Date(productsData.newListings[0].date).toLocaleDateString()}</span>
                  <span>End: {new Date(productsData.newListings[productsData.newListings.length - 1].date).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Sold list growth */}
            <div style={cardStyle} className="space-y-4">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Completed Sales Count</h4>
                <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Daily marked sold listings counts</p>
              </div>
              <div className="h-44 relative" style={chartBgStyle}>
                {productsData.soldListings?.length > 1 ? (
                  drawLineGraph(productsData.soldListings, 'count', 500, 150, '#eab308')
                ) : (
                  <div className="h-full flex items-center justify-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>No sold listings data.</div>
                )}
              </div>
              {productsData.soldListings?.length > 0 && (
                <div className="flex justify-between text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  <span>Start: {new Date(productsData.soldListings[0].date).toLocaleDateString()}</span>
                  <span>End: {new Date(productsData.soldListings[productsData.soldListings.length - 1].date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Category Performance Analytics */}
          <div style={cardStyle}>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>Category Economic Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }} className="font-bold uppercase">
                    <th className="py-2.5 pr-4">Category Class</th>
                    <th className="py-2.5 pr-4">Total Listings</th>
                    <th className="py-2.5 pr-4">Sold Listings</th>
                    <th className="py-2.5 pr-4">Average Listing Price</th>
                    <th className="py-2.5">Conversion Ratio</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {categoriesData.map(c => {
                    const ratio = c.total > 0 ? ((c.sold_count / c.total) * 100).toFixed(1) : '0.0'
                    return (
                      <tr
                        key={c.category}
                        className="transition-colors"
                        style={{ borderBottom: '1px solid var(--border-color)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(35,229,219,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="py-3 pr-4 font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>{c.category || 'Uncategorized'}</td>
                        <td className="py-3 pr-4" style={{ color: 'var(--text-muted)' }}>{c.total} items</td>
                        <td className="py-3 pr-4" style={{ color: 'var(--text-muted)' }}>{c.sold_count} items</td>
                        <td className="py-3 pr-4 font-bold" style={{ color: 'var(--accent)' }}>₹{Number(c.avg_price).toLocaleString()}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded font-bold" style={{ background: 'var(--bg-gradient)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                            {ratio}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
