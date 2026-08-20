import React, { useState, useEffect } from 'react'
import { adminSettingsAPI } from '../../services/adminApi'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    site_name: 'CollegeMart',
    maintenance_mode: 'false',
    allowed_email_domains: '.edu,.in,.org',
    coins_signup: '50',
    coins_mark_sold: '10',
    coins_feature_listing: '20'
  })
  const [loading, setLoading] = useState(true)
  const [adminRole, setAdminRole] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const res = await adminSettingsAPI.getAll()
        // Override default state with loaded DB settings
        setSettings(prev => ({
          ...prev,
          ...res.data
        }))
      } catch (err) {
        setError(err.message || 'Failed to fetch settings')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()

    const savedAdmin = localStorage.getItem('adminUser')
    if (savedAdmin) {
      setAdminRole(JSON.parse(savedAdmin).role)
    }
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    if (adminRole !== 'super_admin') {
      alert('Forbidden: Only Super Admins can save global settings.')
      return
    }
    try {
      await adminSettingsAPI.update(settings)
      alert('Global settings updated successfully')
    } catch (err) {
      alert('Failed to update settings: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
        Fetching configurations...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>System Settings</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Configure global marketplace attributes, restrictions, and financial reward balances.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Settings Panel */}
      <form onSubmit={handleSave} className="p-6 rounded-xl border space-y-6 max-w-2xl shadow-sm" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="space-y-4 text-sm">
          {/* Site name */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Marketplace Name
            </label>
            <input
              type="text"
              required
              value={settings.site_name}
              onChange={(e) => setSettings({...settings, site_name: e.target.value})}
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Maintenance Mode */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Maintenance Mode
            </label>
            <select
              value={settings.maintenance_mode}
              onChange={(e) => setSettings({...settings, maintenance_mode: e.target.value})}
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="false">Inactive / Normal operation</option>
              <option value="true">Active (Restrict access to admins only)</option>
            </select>
          </div>

          {/* Email Restrictions */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Allowed email domains (comma separated)
            </label>
            <input
              type="text"
              required
              value={settings.allowed_email_domains}
              onChange={(e) => setSettings({...settings, allowed_email_domains: e.target.value})}
              placeholder="e.g. .edu,.in,.ac.in"
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
            <p className="text-[10px] mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>Restricts student registrations to emails matching these endings.</p>
          </div>

          <div className="my-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <h4 className="text-xs uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400 mb-4">Coin Economy Pricing</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
                  Registration bonus
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.coins_signup}
                  onChange={(e) => setSettings({...settings, coins_signup: e.target.value})}
                  className="w-full border rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
                  Product sold reward
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.coins_mark_sold}
                  onChange={(e) => setSettings({...settings, coins_mark_sold: e.target.value})}
                  className="w-full border rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--text-muted)' }}>
                  Featured listing fee
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.coins_feature_listing}
                  onChange={(e) => setSettings({...settings, coins_feature_listing: e.target.value})}
                  className="w-full border rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={adminRole !== 'super_admin'}
          className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-white font-bold rounded-xl transition-colors text-sm shadow-md"
        >
          {adminRole !== 'super_admin' ? 'Requires Super Admin Permission' : 'Save Global configurations'}
        </button>
      </form>
    </div>
  )
}
