import React, { useState, useEffect } from 'react'
import { adminCategoriesAPI } from '../../services/adminApi'

const categoryImage = {
  'Books': '/books-category.png',
  'Books & Notes': '/books-category.png',
  'Electronics': '/electronics-category.png',
  'Cycles & Bikes': '/cycles-category.png',
  'Hostel Furniture': '/furniture-category.png',
  'Clothing': '/clothing-category.png',
  'Stationery': '/stationery-category.png',
  'Sports & Hobbies': '/sports-category.png',
  'Lab Equipment': '/lab-category.png',
  'Gadgets': '/gadgets-category.png',
  'Bags & Luggage': '/bags-category.png',
  'Kitchen Items': '/kitchen-category.png',
  'Services': '/services-category.png'
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [form, setForm] = useState({ name: '', emoji: '', description: '' })
  const [adminRole, setAdminRole] = useState('')

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await adminCategoriesAPI.getAll()
      setCategories(res.data)
    } catch (err) {
      setError(err.message || 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    const savedAdmin = localStorage.getItem('adminUser')
    if (savedAdmin) {
      setAdminRole(JSON.parse(savedAdmin).role)
    }
  }, [])

  const handleOpenAdd = () => {
    setSelectedCategory(null)
    setForm({ name: '', emoji: '', description: '' })
    setShowModal(true)
  }

  const handleOpenEdit = (cat) => {
    setSelectedCategory(cat)
    setForm({ name: cat.name || '', emoji: cat.emoji || '', description: cat.description || '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedCategory) {
        await adminCategoriesAPI.update(selectedCategory.id, form)
        alert('Category updated successfully')
      } else {
        await adminCategoriesAPI.create(form)
        alert('Category created successfully')
      }
      setShowModal(false)
      fetchCategories()
    } catch (err) {
      alert('Failed to save category: ' + err.message)
    }
  }

  const handleDelete = async (cat) => {
    if (adminRole !== 'super_admin') {
      alert('Forbidden: Only Super Admins can delete categories.')
      return
    }
    if (!window.confirm(`Are you sure you want to permanently delete category "${cat.name}"? All products categorized under this will become uncategorized.`)) return
    try {
      await adminCategoriesAPI.delete(cat.id)
      alert('Category deleted successfully')
      fetchCategories()
    } catch (err) {
      alert('Failed to delete category: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Category Settings</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manage categories displayed on search indices and marketplace filter tabs.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg text-sm transition-colors flex items-center space-x-2 shadow-md shadow-teal-500/10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          <span>Add Category</span>
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
          Loading marketplace categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
          No categories found. Create one above!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(cat => (
            <div key={cat.id} className="p-5 rounded-xl border transition-all flex flex-col justify-between shadow-sm hover:border-teal-500/30" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-inner overflow-hidden select-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                    {categoryImage[cat.name] || categoryImage[cat.name.trim()] ? (
                      <img
                        src={categoryImage[cat.name] || categoryImage[cat.name.trim()]}
                        alt={cat.name}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <div className="text-2xl">📁</div>
                    )}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">
                    {cat.product_count || 0} listings
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg capitalize" style={{ color: 'var(--text-primary)' }}>{cat.name}</h3>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{cat.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 mt-6 pt-4 border-t text-xs font-semibold" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="flex-1 py-2 border rounded-lg transition-colors text-teal-600 dark:text-teal-400 hover:text-teal-500"
                  style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                >
                  Edit Settings
                </button>
                <button
                  disabled={adminRole !== 'super_admin'}
                  onClick={() => handleDelete(cat)}
                  className="px-3 py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 disabled:opacity-40 disabled:hover:border-rose-500/20 disabled:hover:text-rose-500 text-rose-500 dark:text-rose-400 rounded-lg transition-colors"
                >
                  Delete
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
          <div className="border rounded-2xl w-full max-w-md shadow-2xl relative z-10 p-6 space-y-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{selectedCategory ? 'Edit Category' : 'Create Category'}</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add or edit categories on the platform directory.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Emoji</label>
                  <input
                    type="text"
                    required
                    value={form.emoji}
                    onChange={(e) => setForm({...form, emoji: e.target.value})}
                    placeholder="🍔"
                    maxLength="4"
                    className="w-full border rounded-xl px-2.5 py-2.5 text-center text-lg focus:outline-none focus:border-teal-500"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Category Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="Electronics, Books, Cycle..."
                    className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Provide a brief summary of what listings belong in this category..."
                  rows="3"
                  className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-colors text-sm shadow-md"
              >
                {selectedCategory ? 'Save Category Changes' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
