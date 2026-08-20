import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'
import collegeIcon from '../assets/college-search-icon.svg'

export default function CollegeSelector({ currentCollege, onCollegeChange }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredColleges, setFilteredColleges] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    setSearchQuery(currentCollege || '')
  }, [currentCollege])

  useEffect(() => {
    let active = true;
    const fetchFiltered = async () => {
      if (searchQuery.trim()) {
        try {
          const response = await axios.get('/api/colleges/suggest', { params: { q: searchQuery } })
          if (active) {
            setFilteredColleges(response.data)
            setShowDropdown(true)
            setSelectedIndex(-1)
          }
        } catch (err) {
          console.error(err)
        }
      } else {
        setFilteredColleges([])
        setShowDropdown(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchFiltered();
    }, 200);

    return () => {
      active = false;
      clearTimeout(debounceTimer);
    };
  }, [searchQuery])

  const handleCollegeSelect = (college) => {

    if (inputRef.current) {
      inputRef.current.blur()
    }
    
    if (onCollegeChange) {
      onCollegeChange(college.short)
    }

    setSearchQuery(college.short)
    setShowDropdown(false)
    setFilteredColleges([])
    navigate(`/college/${encodeURIComponent(college.short)}`)
  }

  const handleLocationClick = async () => {
    if (filteredColleges.length > 0) {
      handleCollegeSelect(filteredColleges[0])
      return
    }

    try {
      const response = await axios.get('/api/colleges/find', { params: { name: searchQuery } })
      if (response.data) {
        handleCollegeSelect(response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDropdownToggle = async () => {
    if (showDropdown) {
      setShowDropdown(false)
      return
    }

    try {
      const response = await axios.get('/api/colleges/suggest', { params: { q: searchQuery } })
      setFilteredColleges(response.data)
      setSelectedIndex(-1)
      setShowDropdown(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleKeyDown = (e) => {
    if (!showDropdown) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < filteredColleges.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleCollegeSelect(filteredColleges[selectedIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        break
      default:
        break
    }
  }

  const handleBlur = () => {

    setTimeout(() => {
      setShowDropdown(false)
    }, 200)
  }

const LocationIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    style={{ 
      color: '#002f34', 
      flexShrink: 0,
      marginRight: '2px',
      cursor: 'pointer'
    }}
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

  return (
    <div className="college-selector" ref={dropdownRef} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <div className="college-selector-input-wrapper" onClick={() => inputRef.current?.focus()} style={{ cursor: 'text' }}>
        <LocationIcon aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Your College"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery && setShowDropdown(true)}
          onBlur={handleBlur}
          aria-label="Search and select your college"
          className="college-selector-input"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDropdownToggle();
          }}
          aria-label="Toggle college list dropdown"
          className="college-selector-toggle"
        >
          ▼
        </button>
      </div>

      {showDropdown && filteredColleges.length > 0 && (
        <div 
          role="listbox"
          aria-label="College search suggestions"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
            marginTop: '-4px'
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {filteredColleges.map((college, index) => (
            <div
              key={index}
              role="option"
              aria-selected={selectedIndex === index}
              onMouseDown={() => {
                handleCollegeSelect(college)
              }}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: selectedIndex === index ? '#f0f0f0' : 'white',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#002f34' }}>
                {college.short}
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {college.name} • {college.state}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
