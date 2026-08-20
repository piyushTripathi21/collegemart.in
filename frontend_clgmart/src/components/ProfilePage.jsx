import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../services/api'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../context/ThemeContext'
import { useThemeStyles } from '../context/useThemeStyles'

export default function ProfilePage({ user, onLogout, onOpenLogin }) {
  const navigate = useNavigate()
  const t = useThemeStyles()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const getGradients = () => {
    switch (theme) {
      case 'dark':
        return {
          profileHeader: 'linear-gradient(135deg, #1e2235 0%, #0f1117 100%)',
          wallet: 'linear-gradient(135deg, #1e2235 0%, #0d9488 100%)'
        }
      case 'ocean':
        return {
          profileHeader: 'linear-gradient(135deg, #0a3d62 0%, #1a73e8 100%)',
          wallet: 'linear-gradient(135deg, #1a73e8 0%, #60a5fa 100%)'
        }
      case 'sunset':
        return {
          profileHeader: 'linear-gradient(135deg, #6b2d0e 0%, #f97316 100%)',
          wallet: 'linear-gradient(135deg, #f97316 0%, #fcd34d 100%)'
        }
      case 'light':
      default:
        return {
          profileHeader: 'linear-gradient(135deg, #002f34 0%, #23e5db 100%)', // Signature brand gradient
          wallet: 'linear-gradient(135deg, #0d9488 0%, #23e5db 100%)'        // Vibrant brand teal/cyan wallet gradient
        }
    }
  }

  const gradients = getGradients()

  const [currentUser, setCurrentUser] = useState(user)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    college: currentUser?.college || '',
    phone: currentUser?.phone || ''
  })
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || currentUser?.profile_image || null)
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleProfileUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'))
      if (updatedUser) {
        setCurrentUser(updatedUser)
        setProfileData({
          name: updatedUser?.name || '',
          email: updatedUser?.email || '',
          college: updatedUser?.college || '',
          phone: updatedUser?.phone || ''
        })
        setProfileImage(updatedUser?.profileImage || updatedUser?.profile_image || null)
      }
    }

    window.addEventListener('userProfileUpdated', handleProfileUpdate)
    return () => window.removeEventListener('userProfileUpdated', handleProfileUpdate)
  }, [])

  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {}
        <div style={{
          position: 'absolute', top: '10%', right: '-150px',
          width: '450px', height: '450px', borderRadius: '50%',
          background: isDark ? 'rgba(35,229,219,0.03)' : 'rgba(14,165,233,0.05)',
          pointerEvents: 'none',
          filter: 'blur(90px)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-150px',
          width: '450px', height: '450px', borderRadius: '50%',
          background: isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.05)',
          pointerEvents: 'none',
          filter: 'blur(90px)',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar user={currentUser} onOpenLogin={onOpenLogin} />
          <div style={{ textAlign: 'center', padding: '80px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ color: t.textPrimary, marginBottom: '20px' }}>Please log in to view your profile</h2>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 28px',
                backgroundColor: t.btnPrimary,
                color: t.btnPrimaryText,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                boxShadow: t.cardShadow,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={e => e.target.style.opacity = '0.9'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Back to Home
            </button>
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    try {
      let imageUrl = profileImage

      if (profileImageFile) {
        const formData = new FormData()
        formData.append('profileImage', profileImageFile)
        
        const uploadResponse = await axios.post(
          `/api/users/${currentUser.id}/upload-profile-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        imageUrl = uploadResponse.data.profileImage
      }

      const response = await axios.put(
        `/api/users/${currentUser.id}`,
        {
          name: profileData.name,
          college: profileData.college,
          phone: profileData.phone,
          profileImage: imageUrl
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        }
      )

      const updatedUser = {
        ...currentUser,
        ...response.data,
        profileImage: imageUrl
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      window.dispatchEvent(new Event('userProfileUpdated'))

      setSuccessMessage('Profile updated successfully!')
      setErrorMessage('')
      setIsEditing(false)
      setProfileImageFile(null)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Profile update failed:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update profile'
      setErrorMessage(`Error: ${errorMsg}. Please try again.`)
      setSuccessMessage('')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    onLogout()
    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {}
      <div style={{
        position: 'absolute', top: '100px', right: '-150px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: isDark ? 'rgba(35,229,219,0.03)' : 'rgba(14,165,233,0.05)',
        pointerEvents: 'none',
        filter: 'blur(100px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: '150px', left: '-150px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.05)',
        pointerEvents: 'none',
        filter: 'blur(100px)',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar user={user} onOpenLogin={onOpenLogin} />

        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          {}
          <div style={{
            '--header-gradient': gradients.profileHeader,
            background: 'var(--header-gradient)',
            color: 'white',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '30px',
            boxShadow: t.cardShadow
          }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    border: '4px solid white',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '60px'
                }}>
                  👤
                </div>
              )}
              {isEditing && (
                <label style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  backgroundColor: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  <img
                    src="/camera-icon.png"
                    alt="Upload"
                    style={{
                      width: '20px',
                      height: '20px',
                      objectFit: 'contain'
                    }}
                  />
                  <input
                    type="file"
                    accept="image}
          <div style={{
            '--wallet-gradient': gradients.wallet,
            background: 'var(--wallet-gradient)',
            color: 'white',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            boxShadow: t.cardShadow
          }}>
            <h2 style={{ margin: '0', fontSize: '28px', marginBottom: '10px', color: 'white' }}>My Wallet</h2>
            <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>
              {currentUser?.coins || 0} coins
            </div>
            <p style={{ margin: '0', opacity: 0.9, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
              Earn coins by marking products as sold
            </p>
          </div>

          {}
          <div style={{
            backgroundColor: t.cardBg,
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: `1px solid ${t.borderColor}`,
            boxShadow: t.cardShadow
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{ margin: '0', fontSize: '24px', color: t.textPrimary }}>Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: t.btnPrimary,
                    color: t.btnPrimaryText,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.opacity = '0.9'}
                  onMouseLeave={e => e.target.style.opacity = '1'}
                >
                  Edit Profile
                </button>
              ) : (
                <div>
                  <button
                    onClick={handleSaveProfile}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginRight: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.9'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setProfileData({
                        name: user?.name || '',
                        email: user?.email || '',
                        college: user?.college || '',
                        phone: user?.phone || ''
                      })
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: isDark ? '#374151' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.9'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                  >
                    ✕ Cancel
                  </button>
                </div>
              )}
            </div>

            {}
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: t.textPrimary }}>
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: t.inputBg,
                      color: t.textPrimary,
                      border: `1px solid ${t.borderColor}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                ) : (
                  <p style={{ margin: '0', padding: '12px', backgroundColor: t.cardBg2, color: t.textSecondary, border: `1px solid ${t.borderLight}`, borderRadius: '6px' }}>
                    {profileData.name}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: t.textPrimary }}>
                  Email
                </label>
                <p style={{ margin: '0', padding: '12px', backgroundColor: t.cardBg2, color: t.textMuted, border: `1px solid ${t.borderLight}`, borderRadius: '6px' }}>
                  {profileData.email}
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: t.textPrimary }}>
                  College
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="college"
                    value={profileData.college}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: t.inputBg,
                      color: t.textPrimary,
                      border: `1px solid ${t.borderColor}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                ) : (
                  <p style={{ margin: '0', padding: '12px', backgroundColor: t.cardBg2, color: t.textSecondary, border: `1px solid ${t.borderLight}`, borderRadius: '6px' }}>
                    {profileData.college || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: t.textPrimary }}>
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: t.inputBg,
                      color: t.textPrimary,
                      border: `1px solid ${t.borderColor}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                ) : (
                  <p style={{ margin: '0', padding: '12px', backgroundColor: t.cardBg2, color: t.textSecondary, border: `1px solid ${t.borderLight}`, borderRadius: '6px' }}>
                    {profileData.phone || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {}
          <div style={{
            backgroundColor: t.cardBg,
            padding: '30px',
            borderRadius: '12px',
            border: `1px solid ${t.borderColor}`,
            boxShadow: t.cardShadow,
            marginBottom: '40px'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: t.textPrimary }}>Account Settings</h2>
            
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 28px',
                backgroundColor: 'transparent',
                color: '#ef4444',
                border: '1.5px solid #ef4444',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}
