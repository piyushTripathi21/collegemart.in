import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CategoryTabs({ selectedCategory, setSelectedCategory }) {
  const navigate = useNavigate()
  const categories = [
    '☰ ALL CATEGORIES',
    'Books',
    'Electronics',
    'Cycles & Bikes',
    'Hostel Furniture',
    'Clothing',
    'Stationery',
    'Sports & Hobbies',
    'Lab Equipment'
  ]

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
    
    // If "All Categories" is selected, scroll to categories section
    if (cat === '☰ ALL CATEGORIES') {
      const element = document.getElementById('categories-section')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      // Navigate to category page
      navigate(`/category/${encodeURIComponent(cat)}`)
    }
  }

  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`tab-pill ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => handleCategoryClick(cat)}
        >
          {cat}
        </button>
      ))}
      <span className="date-text ml-auto">{dateStr}</span>
    </div>
  )
}
