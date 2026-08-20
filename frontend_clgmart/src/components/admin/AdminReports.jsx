import React, { useState, useEffect } from 'react'
import { adminReportsAPI } from '../../services/adminApi'

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [error, setError] = useState('')

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await adminReportsAPI.getAll({
        page,
        status: statusFilter || undefined,
        limit: 10
      })
      setReports(res.data.data)
      setPagination(res.data.pagination)
    } catch (err) {
      setError(err.message || 'Failed to fetch reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [page, statusFilter])

  const handleResolve = async (reportId, action) => {
    const confirmMsg = action === 'resolved'
      ? 'Mark this report as resolved? (Listing violations addressed)'
      : 'Dismiss this report? (Invalid report / listing is fine)'
      
    if (!window.confirm(confirmMsg)) return
    try {
      await adminReportsAPI.resolve(reportId, action)
      alert(`Report marked as ${action}`)
      fetchReports()
    } catch (err) {
      alert(`Failed to update report status: ${err.message}`)
    }
  }

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Report Moderation Queue</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Review reported listings flag alerts, verify complaints, and resolve platform violations.</p>
      </div>

      {}
      <div className="p-4 rounded-xl border flex items-center justify-between" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
          Filter Reports:
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => { setStatusFilter('pending'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'pending'
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
            style={statusFilter !== 'pending' ? { background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' } : {}}
          >
            Pending Flags
          </button>
          <button
            onClick={() => { setStatusFilter('resolved'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'resolved'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
            style={statusFilter !== 'resolved' ? { background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' } : {}}
          >
            Resolved Cases
          </button>
          <button
            onClick={() => { setStatusFilter('dismissed'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'dismissed'
                ? 'font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
            style={statusFilter === 'dismissed'
              ? { background: 'var(--bg-gradient)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }
              : { background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }
            }
          >
            Dismissed
          </button>
        </div>
      </div>

      {}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {}
      <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider" style={{ background: 'var(--bg-gradient)', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th className="p-4">Report Details</th>
                <th className="p-4">Product Listing</th>
                <th className="p-4">Reporter Info</th>
                <th className="p-4">Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    Searching flags...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    No reports match this status.
                  </td>
                </tr>
              ) : (
                reports.map(r => (
                  <tr key={r.id} className="hover:bg-teal-500/5 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          {r.reason}
                        </span>
                        <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--text-muted)' }}>Report ID: #{r.id}</p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {r.product_title ? (
                        <div>
                          <p className="font-semibold truncate max-w-[150px]" style={{ color: 'var(--text-primary)' }}>{r.product_title}</p>
                          <p className="text-xs truncate max-w-[150px]" style={{ color: 'var(--text-muted)' }}>Seller: {r.seller_name}</p>
                        </div>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold italic text-xs">Deleted Listing</span>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="truncate max-w-[120px] font-semibold" style={{ color: 'var(--text-primary)' }}>{r.reporter_name || 'Anonymous'}</p>
                      <p className="text-xs truncate max-w-[120px]" style={{ color: 'var(--text-muted)' }}>{r.reporter_email || '—'}</p>
                    </td>
                    <td className="p-4 max-w-[200px] truncate italic" style={{ color: 'var(--text-muted)' }}>
                      {r.details ? `"${r.details}"` : '—'}
                    </td>
                    <td className="p-4">
                      {r.status === 'pending' ? (
                        <span className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold px-2 py-0.5 rounded animate-pulse">
                          Pending Review
                        </span>
                      ) : r.status === 'resolved' ? (
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded">
                          Resolved Case
                        </span>
                      ) : (
                        <span className="border text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                          Dismissed
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {r.status === 'pending' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleResolve(r.id, 'resolved')}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-md"
                          >
                            Resolve / Hide
                          </button>
                          <button
                            onClick={() => handleResolve(r.id, 'dismissed')}
                            className="px-2.5 py-1.5 border text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg text-xs font-semibold transition-colors"
                            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                          >
                            Dismiss Report
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Addressed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {}
        {pagination.pages > 1 && (
          <div className="p-4 border-t flex items-center justify-between text-xs font-semibold" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
            <span>Showing page {pagination.page} of {pagination.pages} ({pagination.total} total reports)</span>
            <div className="flex space-x-1.5">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border rounded-lg transition-colors disabled:opacity-40"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border rounded-lg transition-colors disabled:opacity-40"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
