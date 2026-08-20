import React, { useState, useEffect } from 'react'
import { adminCoinsAPI } from '../../services/adminApi'

export default function AdminCoins() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCoinStats = async () => {
      try {
        setLoading(true)
        const res = await adminCoinsAPI.getStats()
        setStats(res.data)
      } catch (err) {
        setError(err.message || 'Failed to fetch coin statistics')
      } finally {
        setLoading(false)
      }
    }
    fetchCoinStats()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
        Calculating wallet stats...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
        {error}
      </div>
    )
  }

  const maxDistCount = stats?.distribution ? Math.max(...stats.distribution.map(d => d.count), 1) : 1

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Coins & Wallet Economy</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Track platform reward distribution and leaderboard coin balances.</p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Virtual Coins Pool</p>
          <h3 className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-2 tracking-tight">
            🪙 {stats?.total_coins?.toLocaleString() || 0}
          </h3>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Circulating virtual economy pool</p>
        </div>
        <div className="p-5 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Average User Balance</p>
          <h3 className="text-3xl font-extrabold mt-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            🪙 {stats?.avg_coins || 0}
          </h3>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Average coin count per wallet profile</p>
        </div>
        <div className="p-5 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Highest Wallet Balance</p>
          <h3 className="text-3xl font-extrabold mt-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            🪙 {stats?.max_coins || 0}
          </h3>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Peak coin savings in single user wallet</p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className="p-5 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>Coin Holder Leaderboard</h4>
          {stats?.topUsers?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="font-bold uppercase pb-2" style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th className="py-2">User</th>
                    <th className="py-2">Email</th>
                    <th className="py-2 text-right">Coins</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary, #475569)' }}>
                  {stats.topUsers.map(u => (
                    <tr key={u.id} className="hover:bg-teal-500/5 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="py-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</td>
                      <td className="py-2.5 truncate max-w-[150px]" style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-teal-600 dark:text-teal-400">🪙 {u.coins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs py-4 font-mono text-center" style={{ color: 'var(--text-muted)' }}>No leaderboard logs.</p>
          )}
        </div>

        {}
        <div className="p-5 rounded-xl border space-y-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Coin Wallet Distribution</h4>
          {stats?.distribution?.length > 0 ? (
            <div className="space-y-4 pt-2">
              {stats.distribution.map(d => {
                const percent = Math.max(5, (d.count / maxDistCount) * 100)
                return (
                  <div key={d.range_label} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="font-mono" style={{ color: 'var(--text-muted)' }}>🪙 {d.range_label} coins</span>
                      <span style={{ color: 'var(--text-primary)' }}>{d.count} users</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full overflow-hidden border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
                      <div
                        style={{ width: `${percent}%` }}
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs py-4 font-mono text-center" style={{ color: 'var(--text-muted)' }}>No distribution charts.</p>
          )}
        </div>
      </div>
    </div>
  )
}
