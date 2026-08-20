import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'
import CollegeSelector from './CollegeSelector'

const heartIcon = new URL('/heart-icon.svg', import.meta.url).href

const chatIcon = new URL('/envelope-icon.svg', import.meta.url).href
const profileIcon = new URL('/user-profile-icon.svg', import.meta.url).href
const searchIcon = new URL('/search-icon.svg', import.meta.url).href
export default function Navbar({ user, onOpenLogin, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedCollege, onCollegeChange, onSearchSubmit }) {
  const [currentCollege, setCurrentCollege] = React.useState(selectedCollege || '')
  const [searchInput, setSearchInput] = React.useState(searchQuery || '')
  const [notifications, setNotifications] = useState({ unread_messages: 0, pending_offers: 0 })
  const navigate = useNavigate()

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile')
    } else {
      onOpenLogin()
    }
  }

  const handleFavoritesClick = () => {
    if (user) {
      navigate('/favorites')
    } else {
      onOpenLogin()
    }
  }

  const handleSellClick = () => {
    if (user) {
      navigate('/sell')
    } else {
      onOpenLogin()
    }
  }

  const handleChatsClick = () => {
    if (user) {
      navigate('/chats')
    } else {
      onOpenLogin()
    }
  }

  const handleCollegeChange = (collegeName) => {
    setCurrentCollege(collegeName)
    if (onCollegeChange) {
      onCollegeChange(collegeName)
    }
  }

  React.useEffect(() => {
    if (selectedCollege) {
      setCurrentCollege(selectedCollege)
    }
  }, [selectedCollege])

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setNotifications({ unread_messages: 0, pending_offers: 0 })
        return
      }
      try {
        const response = await axios.get('/api/notifications', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        setNotifications(response.data)
      } catch (error) {
        console.error('Unable to load notifications:', error)
      }
    }

    fetchNotifications()
  }, [user])

  const categoryValue = selectedCategory === '☰ ALL CATEGORIES' || selectedCategory === 'All'
    ? ''
    : selectedCategory ?? ''

  React.useEffect(() => {
    setSearchInput(searchQuery || '')
  }, [searchQuery])

  const handleSearchCategoryChange = (value) => {
    if (setSelectedCategory) {
      setSelectedCategory(value || '')
    }
  }

  const handleSearchSubmit = () => {
    const searchText = searchInput.trim()
    if (!searchText) {
      return
    }

    if (setSearchQuery) {
      setSearchQuery(searchText)
    }

    if (setSelectedCategory && categoryValue === '') {
      setSelectedCategory('')
    }

    const params = new URLSearchParams()
    params.set('q', searchText)
    if (categoryValue) {
      params.set('category', categoryValue)
    }

    navigate(`/search?${params.toString()}`)

    if (onSearchSubmit) {
      onSearchSubmit()
    }
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearchSubmit()
    }
  }

  const handleLocationIconClick = () => {
    handleSearchSubmit()
  }

  const handleLogoClick = () => {
    if (onCollegeChange) {
      onCollegeChange('')
    }
    setCurrentCollege('')
    if (setSearchQuery) {
      setSearchQuery('')
    }
    navigate('/')
  }

  React.useEffect(() => {
    setCurrentCollege(selectedCollege || '')
  }, [selectedCollege])

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div
          className="navbar-logo"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <img 
            src="/collegemart_logo.png" 
            alt="CollegeMart Logo" 
            style={{ height: '32px', width: '32px', objectFit: 'contain' }}
          />
          <span>College<span className="accent text-primary-teal">Mart</span></span>
        </div>
        <div className="navbar-college-selector-wrapper">
          <CollegeSelector currentCollege={currentCollege} onCollegeChange={handleCollegeChange} />
        </div>
      </div>

      <div className="navbar-center">
        <div className="navbar-search-bar">
          <div className="search-category-wrapper">
            <select
              className="search-category"
              value={categoryValue}
              onChange={(e) => handleSearchCategoryChange(e.target.value)}
              aria-label="Select category"
            >
              <option value="">All</option>
              <option value="books">Books & Notes</option>
              <option value="electronics">Electronics</option>
              <option value="cycles">Cycles & Bikes</option>
              <option value="furniture">Hostel Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="stationery">Stationery</option>
              <option value="sports">Sports & Hobbies</option>
              <option value="lab">Lab Equipment</option>
              <option value="gadgets">Gadgets</option>
              <option value="bags">Bags & Luggage</option>
              <option value="kitchen">Kitchen Items</option>
              <option value="services">Services</option>
            </select>
          </div>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder='Search "Engineering Books"'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search products"
            />
            <button
              type="button"
              className="search-btn"
              onClick={handleSearchSubmit}
              aria-label="Search"
            >
              <img src={searchIcon} alt="Search" className="search-icon-img" />
            </button>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="navbar-icon-btn"
          onClick={handleChatsClick}
          title={user ? 'View chats' : 'Login to view chats'}
        >
          <img src={chatIcon} alt="Messages" className="navbar-chat-icon" />
          {notifications.unread_messages > 0 && (
            <span className="navbar-badge">{notifications.unread_messages}</span>
          )}
        </button>
        <button
          className="navbar-icon-btn"
          onClick={handleFavoritesClick}
          title={user ? 'View favorites' : 'Login to view favorites'}
        >
          <img src={heartIcon} alt="Favorites" className="navbar-heart-icon" />
        </button>
        <button
          className="navbar-icon-btn navbar-profile-btn"
          onClick={handleProfileClick}
          title={user ? 'View profile' : 'Login to view profile'}
        >
          {user?.profileImage || user?.profile_image ? (
            <img
              src={user.profileImage || user?.profile_image}
              alt="Profile"
              className="navbar-profile-image"
            />
          ) : (
            <img src={profileIcon} alt="Profile" className="navbar-default-avatar" />
          )}
        </button>
        <button className="sell-btn" onClick={handleSellClick}>+ SELL</button>
      </div>
    </nav>
  )
}
