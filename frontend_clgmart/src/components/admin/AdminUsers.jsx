import React, { useState, useEffect, useRef } from 'react'
import { adminUsersAPI, adminCollegesAPI } from '../../services/adminApi'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCollege, setSelectedCollege] = useState('')
  const [bannedFilter, setBannedFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [error, setError] = useState('')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const fetchInFlight = useRef(false)

  const [selectedUser, setSelectedUser] = useState(null)
  const [detailsUser, setDetailsUser] = useState(null)
  const [showBanModal, setShowBanModal] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [banType, setBanType] = useState('permanent')
  const [banExpires, setBanExpires] = useState('')
  const [showCoinsModal, setShowCoinsModal] = useState(false)
  const [coinAmount, setCoinAmount] = useState('')
  const [coinAction, setCoinAction] = useState('add')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', college: '', phone: '', coins: '' })

  const fetchUsers = async () => {
    if (fetchInFlight.current) return
    fetchInFlight.current = true
    setError('')
    setIsRateLimited(false)
    try {
      setLoading(true)
      const res = await adminUsersAPI.getAll({
        page,
        search,
        college: selectedCollege,
        banned: bannedFilter || undefined,
        limit: 10
      })
      setUsers(res.data.data)
      setPagination(res.data.pagination)
    } catch (err) {
      if (err.status === 429) {
        setIsRateLimited(true)
        setError('Too many requests — please wait a moment and try again.')
      } else {
        setError(err.message || 'Failed to fetch users')
      }
    } finally {
      setLoading(false)
      fetchInFlight.current = false
    }
  }

  useEffect(() => {
    const fetchCollegesList = async () => {
      try {
        const res = await adminCollegesAPI.getAll()
        setColleges(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCollegesList()
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [page, selectedCollege, bannedFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const handleOpenDetails = async (userId) => {
    try {
      const res = await adminUsersAPI.getById(userId)
      setDetailsUser(res.data)
    } catch (err) {
      alert('Failed to load user details: ' + err.message)
    }
  }

  const handleBanUser = async () => {
    if (!selectedUser) return
    try {
      await adminUsersAPI.ban(selectedUser.id, banReason, banType, banExpires || null)
      alert('User banned successfully')
      setShowBanModal(false)
      setBanReason('')
      setBanExpires('')
      fetchUsers()
      if (detailsUser && detailsUser.id === selectedUser.id) {
        handleOpenDetails(selectedUser.id)
      }
    } catch (err) {
      alert('Failed to ban user: ' + err.message)
    }
  }

  const handleUnbanUser = async (user) => {
    if (!window.confirm(`Are you sure you want to unban ${user.name}?`)) return
    try {
      await adminUsersAPI.unban(user.id)
      alert('User unbanned successfully')
      fetchUsers()
      if (detailsUser && detailsUser.id === user.id) {
        handleOpenDetails(user.id)
      }
    } catch (err) {
      alert('Failed to unban user: ' + err.message)
    }
  }

  const handleAdjustCoins = async () => {
    if (!selectedUser || !coinAmount || parseInt(coinAmount) <= 0) return
    try {
      await adminUsersAPI.updateCoins(selectedUser.id, parseInt(coinAmount), coinAction)
      alert('Coins updated successfully')
      setShowCoinsModal(false)
      setCoinAmount('')
      fetchUsers()
      if (detailsUser && detailsUser.id === selectedUser.id) {
        handleOpenDetails(selectedUser.id)
      }
    } catch (err) {
      alert('Failed to adjust coins: ' + err.message)
    }
  }

  const handleOpenEdit = (user) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name || '',
      college: user.college || '',
      phone: user.phone || '',
      coins: user.coins || '0'
    })
    setShowEditModal(true)
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    if (!selectedUser) return
    try {
      await adminUsersAPI.update(selectedUser.id, editForm)
      alert('User profile updated successfully')
      setShowEditModal(false)
      fetchUsers()
      if (detailsUser && detailsUser.id === selectedUser.id) {
        handleOpenDetails(selectedUser.id)
      }
    } catch (err) {
      alert('Failed to update profile: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>User Management</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manage all registered site members, ban violations, and adjust coin balances.</p>
      </div>

      {}
      <div className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-teal-500"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
          <button type="submit" className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg text-sm transition-colors">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedCollege}
            onChange={(e) => { setSelectedCollege(e.target.value); setPage(1); }}
            className="border text-sm px-3 py-2.5 rounded-lg focus:outline-none"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">All Colleges</option>
            {colleges.map(c => (
              <option key={c.college} value={c.college}>{c.college}</option>
            ))}
          </select>

          <select
            value={bannedFilter}
            onChange={(e) => { setBannedFilter(e.target.value); setPage(1); }}
            className="border text-sm px-3 py-2.5 rounded-lg focus:outline-none"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">All Statuses</option>
            <option value="false">Active Only</option>
            <option value="true">Banned Only</option>
          </select>
        </div>
      </div>

      {}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{error}</span>
          </div>
          {isRateLimited && (
            <button
              onClick={() => { setPage(1); fetchUsers(); }}
              className="shrink-0 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-bold transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {}
      <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider" style={{ background: 'var(--bg-gradient)', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th className="p-4">User</th>
                <th className="p-4">College</th>
                <th className="p-4">Coins Balance</th>
                <th className="p-4">Listing Count</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    Searching database...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    No matching user records found.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-teal-500/5 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                          {u.profile_image ? (
                            <img src={u.profile_image} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold uppercase text-sm">
                              {u.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate max-w-[150px] sm:max-w-[200px]" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                          <p className="text-xs truncate max-w-[150px] sm:max-w-[200px]" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 max-w-[150px] truncate" style={{ color: 'var(--text-muted)' }}>{u.college || '—'}</td>
                    <td className="p-4 font-mono font-semibold text-teal-600 dark:text-teal-400">🪙 {u.coins || 0}</td>
                    <td className="p-4 font-mono" style={{ color: 'var(--text-muted)' }}>{u.product_count || 0} items</td>
                    <td className="p-4">
                      {u.is_banned ? (
                        <span className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold px-2 py-0.5 rounded">
                          Banned
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenDetails(u.id)}
                          className="px-2.5 py-1.5 border hover:text-slate-900 dark:hover:text-white rounded-lg text-xs font-semibold transition-all"
                          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="px-2.5 py-1.5 border text-teal-600 dark:text-teal-400 hover:text-teal-500 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                        >
                          Edit
                        </button>
                        {u.is_banned ? (
                          <button
                            onClick={() => handleUnbanUser(u)}
                            className="px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-semibold transition-all"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => { setSelectedUser(u); setShowBanModal(true); }}
                            className="px-2.5 py-1.5 bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 rounded-lg text-xs font-semibold transition-all"
                          >
                            Ban
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedUser(u); setShowCoinsModal(true); }}
                          className="px-2.5 py-1.5 bg-teal-500/10 border border-teal-500/25 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 rounded-lg text-xs font-semibold transition-all"
                        >
                          Coins
                        </button>
                      </div>
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
            <span>Showing page {pagination.page} of {pagination.pages} ({pagination.total} total users)</span>
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

      {}
      {detailsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailsUser(null)} />
          <div className="border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 p-6 space-y-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                  {detailsUser.profile_image ? (
                    <img src={detailsUser.profile_image} alt={detailsUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold uppercase text-2xl">
                      {detailsUser.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{detailsUser.name}</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{detailsUser.email} | ID: {detailsUser.id}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold inline-block mt-2 ${
                    detailsUser.is_banned ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {detailsUser.is_banned ? 'Banned Account' : 'Active Account'}
                  </span>
                </div>
              </div>
              <button onClick={() => setDetailsUser(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
              <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
                <p className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Phone Contact</p>
                <p className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{detailsUser.phone || 'Not provided'}</p>
              </div>
              <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
                <p className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>College Institute</p>
                <p className="font-medium mt-1 truncate" style={{ color: 'var(--text-primary)' }}>{detailsUser.college || 'Not set'}</p>
              </div>
              <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
                <p className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Coins Balance</p>
                <p className="text-teal-600 dark:text-teal-400 font-bold mt-1">🪙 {detailsUser.coins || 0} coins</p>
              </div>
            </div>

            {detailsUser.bio && (
              <div className="p-4 rounded-xl border text-sm" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
                <p className="text-xs uppercase font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>User Bio</p>
                <p className="leading-relaxed italic" style={{ color: 'var(--text-primary)' }}>"{detailsUser.bio}"</p>
              </div>
            )}

            {}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>User Products ({detailsUser.products?.length || 0})</h3>
              {detailsUser.products?.length > 0 ? (
                <div className="rounded-xl border overflow-hidden divide-y" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                  {detailsUser.products.map(p => (
                    <div key={p.id} className="p-3 flex items-center justify-between text-xs" style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                        <p className="mt-0.5" style={{ color: 'var(--text-muted)' }}>Category: {p.category} | Price: ₹{p.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {p.sold ? (
                          <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-semibold">Sold</span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-semibold">Active</span>
                        )}
                        {p.is_hidden && (
                          <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded font-semibold">Hidden</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No products listed by this user.</p>
              )}
            </div>

            {}
            {detailsUser.bans?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Ban History</h3>
                <div className="rounded-xl border overflow-hidden divide-y" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                  {detailsUser.bans.map(b => (
                    <div key={b.id} className="p-3 text-xs space-y-1" style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <div className="flex justify-between font-semibold">
                        <span style={{ color: 'var(--text-primary)' }}>Type: {b.ban_type}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{new Date(b.created_at).toLocaleDateString()}</span>
                      </div>
                      <p style={{ color: 'var(--text-primary)' }}><strong style={{ color: 'var(--text-muted)' }}>Reason:</strong> {b.reason}</p>
                      <p style={{ color: 'var(--text-primary)' }}><strong style={{ color: 'var(--text-muted)' }}>Banned by:</strong> {b.banned_by_name || 'Admin'}</p>
                      {b.expires_at && (
                        <p className="text-amber-600 dark:text-amber-500 font-semibold">Expires: {new Date(b.expires_at).toLocaleString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBanModal(false)} />
          <div className="border rounded-2xl w-full max-w-md shadow-2xl relative z-10 p-6 space-y-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Ban Account</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Restricting login and actions for {selectedUser.name}.</p>
              </div>
              <button onClick={() => setShowBanModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Ban Duration</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                    <input
                      type="radio"
                      name="banType"
                      checked={banType === 'permanent'}
                      onChange={() => setBanType('permanent')}
                    />
                    <span>Permanent</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                    <input
                      type="radio"
                      name="banType"
                      checked={banType === 'temporary'}
                      onChange={() => setBanType('temporary')}
                    />
                    <span>Temporary</span>
                  </label>
                </div>
              </div>

              {banType === 'temporary' && (
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Expires At</label>
                  <input
                    type="datetime-local"
                    value={banExpires}
                    onChange={(e) => setBanExpires(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Violation Reason</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Inappropriate listings, scam behavior, profile harassment..."
                  rows="3"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <button
                onClick={handleBanUser}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Apply Account Ban
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showCoinsModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCoinsModal(false)} />
          <div className="border rounded-2xl w-full max-w-md shadow-2xl relative z-10 p-6 space-y-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Adjust Wallet Coins</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Current balance: 🪙 {selectedUser.coins || 0} coins</p>
              </div>
              <button onClick={() => setShowCoinsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Transaction Action</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                    <input
                      type="radio"
                      name="coinAction"
                      checked={coinAction === 'add'}
                      onChange={() => setCoinAction('add')}
                    />
                    <span>Add Coins</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                    <input
                      type="radio"
                      name="coinAction"
                      checked={coinAction === 'deduct'}
                      onChange={() => setCoinAction('deduct')}
                    />
                    <span>Deduct Coins</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Amount</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter coin value..."
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <button
                onClick={handleAdjustCoins}
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Execute Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="border rounded-2xl w-full max-w-md shadow-2xl relative z-10 p-6 space-y-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Edit User Profile</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Modify registered details for {selectedUser.email}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>College</label>
                <input
                  type="text"
                  required
                  value={editForm.college}
                  onChange={(e) => setEditForm({...editForm, college: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Coins Balance</label>
                <input
                  type="number"
                  value={editForm.coins}
                  onChange={(e) => setEditForm({...editForm, coins: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
