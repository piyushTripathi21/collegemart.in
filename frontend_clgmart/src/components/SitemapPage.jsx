import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const sitemapSections = [
  {
    title: 'MOST POPULAR',
    items: ['Books', 'Electronics', 'Cycles & Bikes', 'Hostel Furniture', 'Clothing', 'Stationery']
  },
  {
    title: 'CATEGORIES',
    items: ['All Categories', 'Books', 'Electronics', 'Cycles & Bikes', 'Hostel Furniture', 'Clothing']
  },
  {
    title: 'STATES',
    items: ['Maharashtra', 'Delhi', 'Andhra Pradesh', 'Uttar Pradesh', 'Telangana', 'West Bengal']
  },
  {
    title: 'CITIES',
    items: ['Kolkata', 'Mumbai', 'Chennai', 'Pune', 'Bengaluru', 'Hyderabad']
  },
  {
    title: 'POPULAR SEARCHES',
    items: ['Engineering Books', 'Hostel Bed', 'Smartphone', 'Bike', 'Laptop', 'Furniture']
  }
]

export default function SitemapPage({ user, onOpenLogin, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, selectedCollege, onCollegeChange, onSearchSubmit }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar
        user={user}
        onOpenLogin={onOpenLogin}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCollege={selectedCollege}
        onCollegeChange={onCollegeChange}
        onSearchSubmit={onSearchSubmit}
      />
      <main style={{ padding: '40px 20px', maxWidth: '1180px', margin: '0 auto' }}>
        <section style={{ padding: '40px', borderRadius: '24px', backgroundColor: 'white', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.06)' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            {/* <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>COLLEGEMART</p> */}
            <h1 style={{ fontSize: '42px', color: '#0f172a', fontWeight: 700, marginBottom: '12px' }}>Sitemap</h1>
            <p style={{ color: '#475569', fontSize: '16px', maxWidth: '760px', margin: '0 auto' }}>
              Discover every page, category, and location on CollegeMart from one place. Navigate directly to the most popular sections and search paths.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '26px' }}>
            {sitemapSections.map(section => (
              <div key={section.title}>
                <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700, marginBottom: '16px' }}>{section.title}</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
                  {section.items.map(item => (
                    <li key={item}>
                      <Link
                        to={
                          section.title === 'CATEGORIES'
                            ? `/category/${encodeURIComponent(item)}`
                            : section.title === 'STATES' || section.title === 'CITIES'
                              ? `/college/${encodeURIComponent(item)}`
                              : section.title === 'POPULAR SEARCHES'
                                ? `/search?q=${encodeURIComponent(item)}`
                                : item === 'All Categories'
                                  ? '/'
                                  : `/category/${encodeURIComponent(item)}`
                        }
                        style={{ color: '#0f172a', textDecoration: 'none', fontSize: '14px' }}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
