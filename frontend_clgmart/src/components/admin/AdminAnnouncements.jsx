import React, { useState, useEffect } from 'react'
import { adminAnnouncementsAPI, adminCollegesAPI } from '../../services/adminApi'

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', message: '', target: 'all', targetCollege: '' })
  const [sendingEmailId, setSendingEmailId] = useState(null)
  const [adminRole, setAdminRole] = useState('')

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const res = await adminAnnouncementsAPI.getAll()
      setAnnouncements(res.data)
    } catch (err) {
      setError(err.message || 'Failed to fetch announcements')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
    const fetchCollegesList = async () => {
      try {
        const res = await adminCollegesAPI.getAll()
        setColleges(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCollegesList()

    const savedAdmin = localStorage.getItem('adminUser')
    if (savedAdmin) {
      setAdminRole(JSON.parse(savedAdmin).role)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await adminAnnouncementsAPI.create(form)
      alert('Announcement created successfully')
      setShowModal(false)
      setForm({ title: '', message: '', target: 'all', targetCollege: '' })
      fetchAnnouncements()
    } catch (err) {
      alert('Failed to create announcement: ' + err.message)
    }
  }

  const handleToggleActive = async (ann) => {
    try {
      await adminAnnouncementsAPI.update(ann.id, {
        title: ann.title,
        message: ann.message,
        is_active: !ann.is_active
      })
      alert(`Announcement ${ann.is_active ? 'disabled' : 'enabled'} successfully`)
      fetchAnnouncements()
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const handleSendEmail = async (annId) => {
    if (adminRole !== 'super_admin') {
      alert('Forbidden: Only Super Admins can dispatch bulk email blasts.')
      return
    }
    if (!window.confirm('Send this announcement to all matching users via bulk email blast? This might take a few moments.')) return
    try {
      setSendingEmailId(annId)
      const res = await adminAnnouncementsAPI.sendEmail(annId)
      alert(res.data.message || 'Bulk emails dispatched successfully')
      fetchAnnouncements()
    } catch (err) {
      alert('Failed to send emails: ' + err.message)
    } finally {
      setSendingEmailId(null)
    }
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>System Announcements</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Post notifications and send targeted newsletters to students.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg text-sm transition-colors flex items-center space-x-2 shadow-md shadow-teal-500/10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          <span>Write Notice</span>
        </button>
      </div>

      {}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {}
      {loading ? (
        <div className="text-center py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
          Searching archives...
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
          No notices written yet. Create one above!
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(ann => (
            <div key={ann.id} className="p-5 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between gap-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center space-x-3.5">
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded border ${
                    ann.target === 'college' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                  }`}>
                    {ann.target === 'college' ? `Campus: ${ann.target_college}` : 'All Campuses'}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{new Date(ann.created_at).toLocaleDateString()}</span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>By: {ann.created_by_name}</span>
                </div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{ann.title}</h3>
                <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-primary)' }}>{ann.message}</p>
              </div>

              <div className="flex flex-col justify-center gap-2.5 md:w-48 shrink-0">
                <button
                  onClick={() => handleToggleActive(ann)}
                  className={`w-full py-2.5 text-xs font-bold rounded-lg border transition-all ${
                    ann.is_active
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                  style={!ann.is_active ? { background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' } : {}}
                >
                  {ann.is_active ? 'Disable Notice' : 'Enable Notice'}
                </button>
                <button
                  disabled={sendingEmailId !== null || adminRole !== 'super_admin'}
                  onClick={() => handleSendEmail(ann.id)}
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:hover:bg-teal-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  {sendingEmailId === ann.id ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Blasting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <span>Send Email Blast</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="border rounded-2xl w-full max-w-lg shadow-2xl relative z-10 p-6 space-y-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Create Notice</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Post announcements to system directories.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Target Audience</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <input
                      type="radio"
                      name="target"
                      checked={form.target === 'all'}
                      onChange={() => setForm({...form, target: 'all', targetCollege: ''})}
                    />
                    <span>All Campuses</span>
                  </label>
                  <label className="flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <input
                      type="radio"
                      name="target"
                      checked={form.target === 'college'}
                      onChange={() => setForm({...form, target: 'college'})}
                    />
                    <span>Target Specific Campus</span>
                  </label>
                </div>
              </div>

              {form.target === 'college' && (
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Campus Name</label>
                  <select
                    required
                    value={form.targetCollege}
                    onChange={(e) => setForm({...form, targetCollege: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select college...</option>
                    {colleges.map(c => (
                      <option key={c.college} value={c.college}>{c.college}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Subject / Title</label>
                <input
                  type="text"
                  required
                  placeholder="System Maintenance, Policy Updates..."
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Notice Message</label>
                <textarea
                  required
                  placeholder="Write announcement body..."
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  rows="5"
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-colors text-sm shadow-md"
              >
                Publish System Notice
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
