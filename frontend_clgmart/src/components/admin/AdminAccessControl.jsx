import React, { useState, useEffect } from 'react'
import { adminAccessAPI } from '../../services/adminApi'

export default function AdminAccessControl() {
  const [admins, setAdmins] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('admins') // 'admins' or 'logs'
  const [logsPage, setLogsPage] = useState(1)
  const [logsPagination, setLogsPagination] = useState({ total: 0, pages: 1 })
  const [adminRole, setAdminRole] = useState('')

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'moderator' })
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', role: 'moderator', is_active: true })

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const res = await adminAccessAPI.getAdmins()
      setAdmins(res.data)
    } catch (err) {
      setError(err.message || 'Failed to fetch admin list')
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await adminAccessAPI.getLogs({ page: logsPage, limit: 20 })
      setLogs(res.data.data)
      setLogsPagination(res.data.pagination)
    } catch (err) {
      setError(err.message || 'Failed to fetch activity logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedAdmin = localStorage.getItem('adminUser')
    if (savedAdmin) {
      setAdminRole(JSON.parse(savedAdmin).role)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'admins') {
      fetchAdmins()
    } else {
      fetchLogs()
    }
  }, [activeTab, logsPage])

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    if (adminRole !== 'super_admin') {
      alert('Forbidden: Only Super Admins can add new administrators.')
      return
    }
    try {
      await adminAccessAPI.createAdmin(addForm)
      alert('Admin account created successfully')
      setShowAddModal(false)
      setAddForm({ name: '', email: '', password: '', role: 'moderator' })
      fetchAdmins()
    } catch (err) {
      alert('Failed to create account: ' + err.message)
    }
  }

  const handleOpenEdit = (adm) => {
    setSelectedAdmin(adm)
    setEditForm({
      name: adm.name || '',
      role: adm.role || 'moderator',
      is_active: adm.is_active === 1 || adm.is_active === true
    })
    setShowEditModal(true)
  }

  const handleEditAdmin = async (e) => {
    e.preventDefault()
    if (adminRole !== 'super_admin') {
      alert('Forbidden: Only Super Admins can edit administrator accounts.')
      return
    }
    try {
      await adminAccessAPI.updateAdmin(selectedAdmin.id, editForm)
      alert('Admin account updated successfully')
      setShowEditModal(false)
      fetchAdmins()
    } catch (err) {
      alert('Failed to update account: ' + err.message)
    }
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'super_admin': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
      case 'moderator': return 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20'
      default: return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Access Control & Logs</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manage moderator accounts, allocate roles, and audit access security logs.</p>
        </div>
        {activeTab === 'admins' && adminRole === 'super_admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg text-sm transition-colors flex items-center space-x-2 shadow-md shadow-teal-500/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            <span>Create Admin</span>
          </button>
        )}
      </div>

      {/* Tabs bar */}
      <div className="flex space-x-6 text-sm font-semibold border-b" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={() => { setActiveTab('admins'); setError(''); }}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'admins'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          style={activeTab !== 'admins' ? { color: 'var(--text-muted)' } : {}}
        >
          Administrator Accounts
        </button>
        <button
          onClick={() => { setActiveTab('logs'); setError(''); setLogsPage(1); }}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'logs'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          style={activeTab !== 'logs' ? { color: 'var(--text-muted)' } : {}}
        >
          Security Audit Logs
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Admins Table */}
      {activeTab === 'admins' && (
        <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-wider" style={{ background: 'var(--bg-gradient)', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Active</th>
                  {adminRole === 'super_admin' && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                      Querying administrative users...
                    </td>
                  </tr>
                ) : (
                  admins.map(adm => (
                    <tr key={adm.id} className="hover:bg-teal-500/5 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{adm.name}</td>
                      <td className="p-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{adm.email}</td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${getRoleBadgeClass(adm.role)}`}>
                          {adm.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {adm.is_active ? (
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold px-2 py-0.5 rounded">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                        {adm.last_login ? new Date(adm.last_login).toLocaleString() : 'Never logged in'}
                      </td>
                      {adminRole === 'super_admin' && (
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleOpenEdit(adm)}
                            className="px-2.5 py-1.5 border text-teal-600 dark:text-teal-400 hover:text-teal-500 rounded-lg text-xs font-semibold transition-all"
                            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                          >
                            Edit Access
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity logs */}
      {activeTab === 'logs' && (
        <div className="rounded-xl border overflow-hidden shadow-sm space-y-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="font-bold uppercase tracking-wider" style={{ background: 'var(--bg-gradient)', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Admin Email</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Audit Details</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Executed Date</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                      Scanning log directories...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                      No administrator actions logged.
                    </td>
                  </tr>
                ) : (
                  logs.map(lg => (
                    <tr key={lg.id} className="hover:bg-teal-500/5 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="p-3 font-bold" style={{ color: 'var(--text-muted)' }}>#{lg.id}</td>
                      <td className="p-3" style={{ color: 'var(--text-primary)' }}>{lg.admin_email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded border text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider text-[9px]" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
                          {lg.action}
                        </span>
                      </td>
                      <td className="p-3 max-w-[200px] truncate" style={{ color: 'var(--text-primary)' }} title={lg.details}>
                        {lg.target_type ? `[${lg.target_type} #${lg.target_id}] ` : ''}
                        {lg.details || '—'}
                      </td>
                      <td className="p-3" style={{ color: 'var(--text-muted)' }}>{lg.ip_address}</td>
                      <td className="p-3" style={{ color: 'var(--text-muted)' }}>{new Date(lg.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {logsPagination.pages > 1 && (
            <div className="p-4 border-t flex items-center justify-between text-xs font-semibold font-sans" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              <span>Showing page {logsPagination.page} of {logsPagination.pages} ({logsPagination.total} total logs)</span>
              <div className="flex space-x-1.5">
                <button
                  disabled={logsPagination.page <= 1}
                  onClick={() => setLogsPage(logsPage - 1)}
                  className="px-3 py-1.5 border rounded-lg transition-colors disabled:opacity-45"
                  style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  Previous
                </button>
                <button
                  disabled={logsPagination.page >= logsPagination.pages}
                  onClick={() => setLogsPage(logsPage + 1)}
                  className="px-3 py-1.5 border rounded-lg transition-colors disabled:opacity-45"
                  style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="border rounded-2xl w-full max-w-md shadow-2xl relative z-10 p-6 space-y-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Create Admin Account</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add moderators or support staff profiles.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Super Admin, John Doe..."
                  value={addForm.name}
                  onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="mod@collegemart.com"
                  value={addForm.email}
                  onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters..."
                  value={addForm.password}
                  onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Access Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="moderator">Moderator (Manage users/products/categories/announcements)</option>
                  <option value="support">Support (Read-only + dashboard views)</option>
                  <option value="super_admin">Super Admin (Full global settings access + admins CRUD)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-colors text-sm shadow-md"
              >
                Create Staff Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="border rounded-2xl w-full max-w-md shadow-2xl relative z-10 p-6 space-y-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold font-sans" style={{ color: 'var(--text-primary)' }}>Edit Admin Profile</h2>
                <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Email: {selectedAdmin.email}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleEditAdmin} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Staff Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Role Level</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="moderator">Moderator</option>
                  <option value="support">Support</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Profile Account Status</label>
                <select
                  value={editForm.is_active ? 'true' : 'false'}
                  onChange={(e) => setEditForm({...editForm, is_active: e.target.value === 'true'})}
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="true">Active staff member (Allowed login access)</option>
                  <option value="false">Disabled / Suspended account</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-colors text-sm shadow-md"
              >
                Save Profile Configuration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
