import React, { useState, useEffect } from 'react'
import { adminTransactionsAPI } from '../../services/adminApi'

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const res = await adminTransactionsAPI.getAll({ page, limit: 15 })
        setTransactions(res.data.data)
        setPagination(res.data.pagination)
      } catch (err) {
        setError(err.message || 'Failed to fetch transactions')
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [page])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Financial Transactions</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>View platform sales, payment volumes, and wallet transactional logs.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Transactions Table */}
      <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider" style={{ background: 'var(--bg-gradient)', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th className="p-4">TXN ID</th>
                <th className="p-4">Product listing</th>
                <th className="p-4">Buyer name</th>
                <th className="p-4">Seller name</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Created Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    No transactions recorded.
                  </td>
                </tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.id} className="hover:bg-teal-500/5 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="p-4 font-mono text-xs font-bold" style={{ color: 'var(--text-muted)' }}>#{t.id}</td>
                    <td className="p-4 font-semibold truncate max-w-[180px]" style={{ color: 'var(--text-primary)' }}>{t.product_title || 'Unlisted Item'}</td>
                    <td className="p-4" style={{ color: 'var(--text-primary)' }}>{t.buyer_name || 'Anonymous'}</td>
                    <td className="p-4" style={{ color: 'var(--text-primary)' }}>{t.seller_name || 'Anonymous'}</td>
                    <td className="p-4 font-mono font-bold text-teal-600 dark:text-teal-400">₹{t.amount}</td>
                    <td className="p-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{new Date(t.created_at).toLocaleString()}</td>
                    <td className="p-4">
                      {t.status === 'completed' ? (
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded">
                          Completed
                        </span>
                      ) : t.status === 'pending' ? (
                        <span className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs font-semibold px-2.5 py-0.5 rounded animate-pulse">
                          Pending
                        </span>
                      ) : (
                        <span className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold px-2.5 py-0.5 rounded">
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t flex items-center justify-between text-xs font-semibold" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
            <span>Showing page {pagination.page} of {pagination.pages} ({pagination.total} total transactions)</span>
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
