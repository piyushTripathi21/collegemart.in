import React, { useState, useEffect } from 'react'
import { adminCollegesAPI } from '../../services/adminApi'

export default function AdminColleges() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true)
        const res = await adminCollegesAPI.getAll()
        setColleges(res.data)
      } catch (err) {
        setError(err.message || 'Failed to fetch colleges')
      } finally {
        setLoading(false)
      }
    }
    fetchColleges()
  }, [])

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Active College Directories</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>View performance listings and registration density per college institute.</p>
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
                <th className="p-4">Rank</th>
                <th className="p-4">College / University Name</th>
                <th className="p-4">Registered Users</th>
                <th className="p-4">Active Listings</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    Loading campus indexes...
                  </td>
                </tr>
              ) : colleges.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    No active college campuses recorded.
                  </td>
                </tr>
              ) : (
                colleges.map((c, i) => (
                  <tr key={c.college} className="hover:bg-teal-500/5 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="p-4 font-mono font-bold w-20" style={{ color: 'var(--text-muted)' }}>
                      {i + 1}
                    </td>
                    <td className="p-4 truncate max-w-[350px] font-semibold" style={{ color: 'var(--text-primary)' }}>{c.college}</td>
                    <td className="p-4 font-mono text-teal-600 dark:text-teal-400">{c.user_count} members</td>
                    <td className="p-4 font-mono" style={{ color: 'var(--text-muted)' }}>{c.product_count} listings</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
