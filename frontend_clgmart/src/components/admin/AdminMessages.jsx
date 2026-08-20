import React, { useState } from 'react'
import { adminMessagesAPI } from '../../services/adminApi'

export default function AdminMessages() {
  const [productId, setProductId] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleFetchMessages = async (e) => {
    e.preventDefault()
    if (!productId || isNaN(productId)) {
      setError('Please enter a valid numeric Product ID')
      return
    }
    setError('')
    setLoading(true)
    setSearched(true)
    try {
      const res = await adminMessagesAPI.getByProduct(productId)
      setMessages(res.data)
    } catch (err) {
      setError(err.message || 'Failed to fetch conversation logs')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Are you sure you want to delete this message? This action is permanent.')) return
    try {
      await adminMessagesAPI.delete(msgId)
      alert('Message deleted successfully')
      setMessages(messages.filter(m => m.id !== msgId))
    } catch (err) {
      alert('Failed to delete message: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Chat Message Moderation</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Inspect conversation transcripts for listings and moderate policy violations.</p>
      </div>

      {}
      <div className="p-5 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <form onSubmit={handleFetchMessages} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 space-y-1.5">
            <label className="block text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }} htmlFor="prodId">
              Search by Product ID
            </label>
            <input
              type="text"
              id="prodId"
              placeholder="e.g. 42, 107"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full border text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-teal-500"
              style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Fetching logs...' : 'Inspect Conversation'}
          </button>
        </form>
      </div>

      {}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {}
      {searched && !loading && (
        <div className="rounded-xl border p-6 shadow-sm space-y-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Conversation transcript log for Product #{productId}
            </h3>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {messages.length} messages found
            </span>
          </div>

          {messages.length === 0 ? (
            <p className="text-sm py-12 text-center font-mono italic" style={{ color: 'var(--text-muted)' }}>
              No chat logs recorded for this listing.
            </p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 divide-y divide-transparent scrollbar-thin">
              {messages.map((m) => (
                <div key={m.id} className="pt-4 flex justify-between items-start group">
                  <div className="space-y-1.5 flex-1 pr-6">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-bold text-teal-600 dark:text-teal-400">{m.sender_name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>→</span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{m.receiver_name}</span>
                      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>| {new Date(m.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap p-3 rounded-lg border max-w-2xl mt-1.5" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                      {m.message}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(m.id)}
                    className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete Message
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
