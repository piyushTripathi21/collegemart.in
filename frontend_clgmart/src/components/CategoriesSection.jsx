import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CategoriesSection() {
  const navigate = useNavigate()
  const categories = [
    { image: '/books-category.png', name: 'Books' },
    { image: '/electronics-category.png', name: 'Electronics' },
    { image: '/cycles-category.png', name: 'Cycles & Bikes' },
    { image: '/furniture-category.png', name: 'Hostel Furniture' },
    { image: '/clothing-category.png', name: 'Clothing' },
    { image: '/stationery-category.png', name: 'Stationery' },
    { image: '/sports-category.png', name: 'Sports & Hobbies' },
    { image: '/lab-category.png', name: 'Lab Equipment' },
    { image: '/gadgets-category.png', name: 'Gadgets' },
    { image: '/bags-category.png', name: 'Bags & Luggage' },
    { image: '/kitchen-category.png', name: 'Kitchen Items' },
    { image: '/services-category.png', name: 'Services' },
  ]

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`)
  }

  return (
    <div id="categories-section">
      <h2 className="section-title">All Categories</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div 
            key={cat.name} 
            className="category-card"
            onClick={() => handleCategoryClick(cat.name)}
            style={{ cursor: 'pointer' }}
          >
            <div className="emoji">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                />
              ) : (
                cat.emoji
              )}
            </div>
            <div className="name">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
