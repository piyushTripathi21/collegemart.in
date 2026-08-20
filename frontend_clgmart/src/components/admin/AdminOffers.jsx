import React, { useState, useEffect } from 'react'
import { adminOffersAPI } from '../../services/adminApi'

export default function AdminOffers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true)
        const res = await adminOffersAPI.getAll({ page, limit: 15 })
        setOffers(res.data.data)
        setPagination(res.data.pagination)
      } catch (err) {
        setError(err.message || 'Failed to fetch offers')
      } finally {
        setLoading(false)
      }
    }
    fetchOffers()
  }, [page])

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Product Offers</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>View bargaining activity, bid values, and offer statuses between users.</p>
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
                <th className="p-4">Offer ID</th>
                <th className="p-4">Product Listing</th>
                <th className="p-4">Buyer (Offer Maker)</th>
                <th className="p-4">Seller (Owner)</th>
                <th className="p-4">Offered Price</th>
                <th className="p-4">Sent Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    Loading offers...
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    No offers recorded yet.
                  </td>
                </tr>
              ) : (
                offers.map(o => (
                  <tr key={o.id} className="hover:bg-teal-500/5 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="p-4 font-mono text-xs font-bold" style={{ color: 'var(--text-muted)' }}>#{o.id}</td>
                    <td className="p-4 font-semibold truncate max-w-[180px]" style={{ color: 'var(--text-primary)' }}>{o.product_title || 'Unlisted Item'}</td>
                    <td className="p-4" style={{ color: 'var(--text-primary)' }}>{o.buyer_name || 'Anonymous'}</td>
                    <td className="p-4" style={{ color: 'var(--text-primary)' }}>{o.seller_name || 'Anonymous'}</td>
                    <td className="p-4 font-mono font-bold text-teal-600 dark:text-teal-400">₹{o.amount}</td>
                    <td className="p-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{new Date(o.created_at).toLocaleString()}</td>
                    <td className="p-4">
                      {o.status === 'accepted' ? (
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded">
                          Accepted
                        </span>
                      ) : o.status === 'rejected' ? (
                        <span className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold px-2.5 py-0.5 rounded">
                          Rejected
                        </span>
                      ) : (
                        <span className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs font-semibold px-2.5 py-0.5 rounded animate-pulse">
                          Pending
                        </span>
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
            <span>Showing page {pagination.page} of {pagination.pages} ({pagination.total} total offers)</span>
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
