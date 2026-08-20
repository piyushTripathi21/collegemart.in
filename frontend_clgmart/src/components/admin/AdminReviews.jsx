import React, { useState, useEffect } from 'react'
import { adminReviewsAPI } from '../../services/adminApi'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [error, setError] = useState('')

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await adminReviewsAPI.getAll({ page, limit: 15 })
      setReviews(res.data.data)
      setPagination(res.data.pagination)
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [page])

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return
    try {
      await adminReviewsAPI.delete(reviewId)
      alert('Review deleted successfully')
      fetchReviews()
    } catch (err) {
      alert('Failed to delete review: ' + err.message)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}>
          ★
        </span>
      )
    }
    return <div className="flex text-lg leading-none">{stars}</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Seller Reviews Moderation</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Moderate feedback left by buyers and delete reviews violating guidelines.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Reviews Table */}
      <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider" style={{ background: 'var(--bg-gradient)', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th className="p-4">Review ID</th>
                <th className="p-4">Product listing</th>
                <th className="p-4">Reviewer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Comment</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    Searching reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    No reviews logged yet.
                  </td>
                </tr>
              ) : (
                reviews.map(r => (
                  <tr key={r.id} className="hover:bg-teal-500/5 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="p-4 font-mono text-xs font-bold" style={{ color: 'var(--text-muted)' }}>#{r.id}</td>
                    <td className="p-4 font-semibold truncate max-w-[150px]" style={{ color: 'var(--text-primary)' }}>{r.product_title || 'Unlisted Product'}</td>
                    <td className="p-4">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{r.reviewer_name || 'Anonymous'}</p>
                      <p className="text-xs truncate max-w-[120px]" style={{ color: 'var(--text-muted)' }}>{r.reviewer_email || '—'}</p>
                    </td>
                    <td className="p-4 font-mono font-bold">{renderStars(r.rating)}</td>
                    <td className="p-4 max-w-[200px] truncate italic" style={{ color: 'var(--text-primary)' }}>"{r.comment || 'No comment provided'}"</td>
                    <td className="p-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-colors"
                      >
                        Delete Review
                      </button>
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
            <span>Showing page {pagination.page} of {pagination.pages} ({pagination.total} total reviews)</span>
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
