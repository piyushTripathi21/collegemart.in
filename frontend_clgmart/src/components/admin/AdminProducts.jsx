import React, { useState, useEffect } from 'react'
import { adminProductsAPI, adminCategoriesAPI } from '../../services/adminApi'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [soldFilter, setSoldFilter] = useState('')
  const [hiddenFilter, setHiddenFilter] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [error, setError] = useState('')

  // Modals state
  const [detailsProduct, setDetailsProduct] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showHideModal, setShowHideModal] = useState(false)
  const [hideReason, setHideReason] = useState('')
  const [hideValue, setHideValue] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', condition: 'like-new', category: '', location: '' })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await adminProductsAPI.getAll({
        page,
        search,
        category: selectedCategory,
        sold: soldFilter || undefined,
        hidden: hiddenFilter || undefined,
        featured: featuredFilter || undefined,
        limit: 10
      })
      setProducts(res.data.data)
      setPagination(res.data.pagination)
    } catch (err) {
      setError(err.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchCategoriesList = async () => {
      try {
        const res = await adminCategoriesAPI.getAll()
        setCategories(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategoriesList()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [page, selectedCategory, soldFilter, hiddenFilter, featuredFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  const handleOpenDetails = async (productId) => {
    try {
      const res = await adminProductsAPI.getById(productId)
      setDetailsProduct(res.data)
    } catch (err) {
      alert('Failed to load product details: ' + err.message)
    }
  }

  const handleToggleFeatured = async (product) => {
    try {
      const res = await adminProductsAPI.toggleFeatured(product.id)
      alert(res.data.featured ? 'Product is now featured' : 'Product is no longer featured')
      fetchProducts()
      if (detailsProduct && detailsProduct.id === product.id) {
        handleOpenDetails(product.id)
      }
    } catch (err) {
      alert('Failed to toggle featured status: ' + err.message)
    }
  }

  const handleHideToggle = async () => {
    if (!selectedProduct) return
    try {
      await adminProductsAPI.toggleHide(selectedProduct.id, hideValue, hideReason)
      alert(hideValue ? 'Product is now hidden' : 'Product is now visible')
      setShowHideModal(false)
      setHideReason('')
      fetchProducts()
      if (detailsProduct && detailsProduct.id === selectedProduct.id) {
        handleOpenDetails(selectedProduct.id)
      }
    } catch (err) {
      alert('Failed to update product visibility: ' + err.message)
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`WARNING: Are you sure you want to permanently delete the product "${product.title}"? This action is irreversible.`)) return
    try {
      await adminProductsAPI.delete(product.id)
      alert('Product deleted successfully')
      fetchProducts()
      if (detailsProduct && detailsProduct.id === product.id) {
        setDetailsProduct(null)
      }
    } catch (err) {
      alert('Failed to delete product: ' + err.message)
    }
  }

  const handleOpenEdit = (product) => {
    setSelectedProduct(product)
    setEditForm({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      condition: product.condition || 'like-new',
      category: product.category || '',
      location: product.location || ''
    })
    setShowEditModal(true)
  }

  const handleEditProduct = async (e) => {
    e.preventDefault()
    if (!selectedProduct) return
    try {
      await adminProductsAPI.update(selectedProduct.id, editForm)
      alert('Product updated successfully')
      setShowEditModal(false)
      fetchProducts()
      if (detailsProduct && detailsProduct.id === selectedProduct.id) {
        handleOpenDetails(selectedProduct.id)
      }
    } catch (err) {
      alert('Failed to update product: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Product Management</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>View and moderate all college listings, toggle featured status, or hide policy violations.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-teal-500"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
          <button type="submit" className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg text-sm transition-colors">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2.5">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="border text-xs px-2.5 py-2 rounded-lg focus:outline-none"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={soldFilter}
            onChange={(e) => { setSoldFilter(e.target.value); setPage(1); }}
            className="border text-xs px-2.5 py-2 rounded-lg focus:outline-none"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">All Transactions</option>
            <option value="false">Active Listings</option>
            <option value="true">Sold Listings</option>
          </select>

          <select
            value={hiddenFilter}
            onChange={(e) => { setHiddenFilter(e.target.value); setPage(1); }}
            className="border text-xs px-2.5 py-2 rounded-lg focus:outline-none"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">All Visibilities</option>
            <option value="false">Public Only</option>
            <option value="true">Hidden Only</option>
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1); }}
            className="border text-xs px-2.5 py-2 rounded-lg focus:outline-none"
            style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">Featured Status</option>
            <option value="true">Featured Only</option>
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-xl border overflow-hidden shadow-sm" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider" style={{ background: 'var(--bg-gradient)', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th className="p-4">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Seller / Institute</th>
                <th className="p-4">Reports</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    Scanning listings...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-mono" style={{ color: 'var(--text-muted)' }}>
                    No matching product records found.
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="hover:bg-teal-500/5 transition-colors" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded overflow-hidden shrink-0 flex items-center justify-center text-lg select-none" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <span style={{ color: 'var(--text-primary)' }}>{p.emoji || '📦'}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate max-w-[150px] sm:max-w-[200px] flex items-center" style={{ color: 'var(--text-primary)' }}>
                            {p.title}
                            {p.featured ? (
                              <span className="ml-1.5 text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 px-1 py-0.5 rounded font-bold">
                                Featured
                              </span>
                            ) : null}
                          </p>
                          <p className="text-xs truncate max-w-[150px] sm:max-w-[200px]" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 capitalize" style={{ color: 'var(--text-muted)' }}>{p.category}</td>
                    <td className="p-4 font-mono font-semibold text-teal-600 dark:text-teal-400">₹{p.price}</td>
                    <td className="p-4">
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{p.seller_name || 'Admin'}</p>
                      <p className="text-xs truncate max-w-[120px]" style={{ color: 'var(--text-muted)' }}>{p.college || '—'}</p>
                    </td>
                    <td className="p-4">
                      {p.report_count > 0 ? (
                        <span className="bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full border border-rose-500/20 animate-pulse">
                          ⚠️ {p.report_count}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col space-y-1">
                        {p.sold ? (
                          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded w-max">
                            Sold
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded w-max">
                            Active
                          </span>
                        )}
                        {p.is_hidden ? (
                          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold px-1.5 py-0.5 rounded w-max">
                            Hidden
                          </span>
                        ) : (
                          <span className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-1.5 py-0.5 rounded w-max">
                            Public
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenDetails(p.id)}
                          className="px-2.5 py-1.5 border hover:text-slate-900 dark:hover:text-white rounded-lg text-xs font-semibold transition-all"
                          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-2.5 py-1.5 border text-teal-600 dark:text-teal-400 hover:text-teal-500 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`px-2.5 py-1.5 border rounded-lg text-xs font-semibold transition-all ${
                            p.featured
                              ? 'bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                              : 'hover:text-slate-900 dark:hover:text-white'
                          }`}
                          style={!p.featured ? { background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' } : {}}
                        >
                          {p.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          onClick={() => { setSelectedProduct(p); setHideValue(!p.is_hidden); setHideReason(p.hidden_reason || ''); setShowHideModal(true); }}
                          className={`px-2.5 py-1.5 border rounded-lg text-xs font-semibold transition-all ${
                            p.is_hidden
                              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/25 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {p.is_hidden ? 'Unhide' : 'Hide'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
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
            <span>Showing page {pagination.page} of {pagination.pages} ({pagination.total} total products)</span>
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

      {/* Product Details Modal */}
      {detailsProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailsProduct(null)} />
          <div className="border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 p-6 space-y-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded">
                  {detailsProduct.category}
                </span>
                <h2 className="text-xl font-bold mt-3 flex items-center" style={{ color: 'var(--text-primary)' }}>
                  {detailsProduct.emoji} {detailsProduct.title}
                  {detailsProduct.featured && (
                    <span className="ml-2.5 text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded font-bold">
                      Featured
                    </span>
                  )}
                </h2>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Product ID: {detailsProduct.id} | Listed on: {new Date(detailsProduct.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setDetailsProduct(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Images Gallery */}
            {detailsProduct.images?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Image Gallery</p>
                <div className="flex flex-wrap gap-3">
                  {detailsProduct.images.map((img, i) => (
                    <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="w-24 h-24 rounded overflow-hidden shrink-0 hover:border-teal-500 transition-colors" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Descriptions & Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
                <p className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Price</p>
                <p className="text-teal-600 dark:text-teal-400 font-bold text-lg mt-1">₹{detailsProduct.price}</p>
              </div>
              <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
                <p className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Condition</p>
                <p className="font-semibold text-sm mt-1 capitalize" style={{ color: 'var(--text-primary)' }}>{detailsProduct.condition}</p>
              </div>
              <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
                <p className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Location / College</p>
                <p className="font-medium text-sm mt-1 truncate" style={{ color: 'var(--text-primary)' }}>{detailsProduct.location}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border text-sm" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs uppercase font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</p>
              <p className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{detailsProduct.description}</p>
            </div>

            {/* Seller Contact Info */}
            <div className="p-4 rounded-xl border text-sm space-y-3" style={{ background: 'var(--bg-gradient)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Seller Information</p>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
                <p style={{ color: 'var(--text-primary)' }}><span style={{ color: 'var(--text-muted)' }} className="font-medium">Name:</span> {detailsProduct.seller_name}</p>
                <p style={{ color: 'var(--text-primary)' }}><span style={{ color: 'var(--text-muted)' }} className="font-medium">Email:</span> {detailsProduct.seller_email}</p>
                <p style={{ color: 'var(--text-primary)' }}><span style={{ color: 'var(--text-muted)' }} className="font-medium">college:</span> {detailsProduct.college || '—'}</p>
              </div>
            </div>

            {/* Visibility notes */}
            {detailsProduct.is_hidden && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-sm">
                <p className="text-rose-600 dark:text-rose-400 font-bold text-xs uppercase mb-1">Hidden from Public View</p>
                <p className="font-medium italic" style={{ color: 'var(--text-primary)' }}>"Reason: {detailsProduct.hidden_reason || 'No reason specified'}"</p>
              </div>
            )}

            {/* Reports moderation list */}
            {detailsProduct.reports?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Reports Moderation queue ({detailsProduct.reports.length})</h3>
                <div className="rounded-xl border overflow-hidden divide-y" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                  {detailsProduct.reports.map(r => (
                    <div key={r.id} className="p-3 text-xs space-y-1" style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <div className="flex justify-between font-semibold">
                        <span className="text-rose-600 dark:text-rose-400">Reason: {r.reason}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleString()}</span>
                      </div>
                      {r.details && (
                        <p className="italic" style={{ color: 'var(--text-primary)' }}>"Details: {r.details}"</p>
                      )}
                      <p style={{ color: 'var(--text-muted)' }}>Reported by: {r.reporter_name || 'Anonymous user'} | Status: <strong className="capitalize">{r.status}</strong></p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hide Reason Modal */}
      {showHideModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHideModal(false)} />
          <div className="border rounded-2xl w-full max-w-md shadow-2xl relative z-10 p-6 space-y-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{hideValue ? 'Hide Listing' : 'Unhide Listing'}</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{hideValue ? 'Hide this listing from all public search results.' : 'Return listing to active search indexing.'}</p>
              </div>
              <button onClick={() => setShowHideModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              {hideValue && (
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Reason for Hide</label>
                  <textarea
                    value={hideReason}
                    onChange={(e) => setHideReason(e.target.value)}
                    placeholder="Suspected spam, duplicate listing, reported copyright issues..."
                    rows="3"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              )}

              <button
                onClick={handleHideToggle}
                className={`w-full py-2.5 font-bold rounded-xl transition-colors text-sm ${
                  hideValue ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {hideValue ? 'Confirm Hide Listing' : 'Confirm Unhide Listing'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="border rounded-2xl w-full max-w-lg shadow-2xl relative z-10 p-6 max-h-[90vh] overflow-y-auto space-y-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Edit Product Details</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ID: {selectedProduct.id}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleEditProduct} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Product Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Condition</label>
                  <select
                    value={editForm.condition}
                    onChange={(e) => setEditForm({...editForm, condition: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="new">Brand New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good Condition</option>
                    <option value="fair">Fair / Used</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Location / College</label>
                  <input
                    type="text"
                    required
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
                <textarea
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows="4"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Save Listing Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
