import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useTheme } from './context/ThemeContext'
import { useToast } from './context/ToastContext'
import SplashScreen from './components/SplashScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoryTabs from './components/CategoryTabs'
import CategoriesSection from './components/CategoriesSection'
import HowItWorks from './components/HowItWorks'
import ProductsSection from './components/ProductsSection'
import FreshRecommendations from './components/FreshRecommendations'
import ProductDetailsPage from './components/ProductDetailsPage'
import CategoryPage from './components/CategoryPage'
import Footer from './components/Footer'
import WhyChooseUs from './components/WhyChooseUs'
import CollegesSection from './components/CollegesSection'
import ProfilePage from './components/ProfilePage'
import FavoritesPage from './components/FavoritesPage'
import CollegeDetailsPage from './components/CollegeDetailsPage'
import SellPage from './components/SellPage'
import AboutPage from './components/AboutPage'
import BlogPage from './components/BlogPage'
import BlogPostDetail from './components/BlogPostDetail'
import CareersPage from './components/CareersPage'
import SearchResultsPage from './components/SearchResultsPage'
import ChatPage from './components/ChatPage'
import SitemapPage from './components/SitemapPage'
import LegalPrivacyPage from './components/LegalPrivacyPage'
import PrivacyPolicyPage from './components/PrivacyPolicyPage'
import TermsOfUsePage from './components/TermsOfUsePage'
import PrevPrivacyPolicyPage from './components/PrevPrivacyPolicyPage'
import PrevTermsPage from './components/PrevTermsPage'
import LoginModal from './components/LoginModal'
import HelpCenter from './components/HelpCenter'
import HelpArticlePage from './components/HelpArticlePage'
import FAQPage from './components/FAQPage'
import ResetPasswordPage from './components/ResetPasswordPage'
import VerifyEmailPage from './components/VerifyEmailPage'
import ContactPage from './components/ContactPage'


// Admin panel views
import AdminLogin from './components/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminUsers from './components/admin/AdminUsers'
import AdminProducts from './components/admin/AdminProducts'
import AdminCategories from './components/admin/AdminCategories'
import AdminReports from './components/admin/AdminReports'
import AdminTransactions from './components/admin/AdminTransactions'
import AdminOffers from './components/admin/AdminOffers'
import AdminMessages from './components/admin/AdminMessages'
import AdminReviews from './components/admin/AdminReviews'
import AdminCoins from './components/admin/AdminCoins'
import AdminColleges from './components/admin/AdminColleges'
import AdminAnnouncements from './components/admin/AdminAnnouncements'
import AdminSettings from './components/admin/AdminSettings'
import AdminAnalytics from './components/admin/AdminAnalytics'
import AdminAccessControl from './components/admin/AdminAccessControl'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

const AppContent = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [selectedCategory, setSelectedCategory] = useState('☰ ALL CATEGORIES')
  const [selectedCollege, setSelectedCollege] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const freshRecommendationsRef = useRef(null)
  // Show splash only once per browser session
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('splashShown'))

  const { showToast } = useToast()

  // Listen for online/offline status
  useEffect(() => {
    const handleOnline = () => {
      showToast('Your internet connection has been restored.', 'success', 3000)
    }
    const handleOffline = () => {
      showToast('You are offline. Please check your internet connection.', 'warning', 5000)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [showToast])

  // Listen for global API errors dispatched by the axios interceptor
  useEffect(() => {
    const handleApiError = (e) => {
      const { code, message } = e.detail || {}
      const type = code === 'NETWORK_ERROR' ? 'warning'
        : code === 'RATE_LIMITED' ? 'warning'
        : code === 'SESSION_EXPIRED' ? 'info'
        : 'error'
      showToast(message || 'An unexpected error occurred.', type, 5000)
    }
    window.addEventListener('api:error', handleApiError)
    return () => window.removeEventListener('api:error', handleApiError)
  }, [showToast])

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('user') // clear corrupted data
      }
    }

    // Listen for profile updates
    const handleProfileUpdate = () => {
      const updatedUser = localStorage.getItem('user')
      if (updatedUser) {
        try { setUser(JSON.parse(updatedUser)) } catch { /* ignore */ }
      }
    }

    window.addEventListener('userProfileUpdated', handleProfileUpdate)
    return () => window.removeEventListener('userProfileUpdated', handleProfileUpdate)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const openLoginModal = () => {
    setShowLoginModal(true)
  }

  const closeLoginModal = () => {
    setShowLoginModal(false)
  }

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => {
          sessionStorage.setItem('splashShown', '1')
          setShowSplash(false)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route
          path="/"
          element={
            <div style={{
              background: 'var(--bg-gradient)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '100vh',
            }}>
              {/* Subtle decorative blobs across the home page */}
              <div style={{
                position: 'absolute', top: '100px', right: '-150px',
                width: '600px', height: '600px', borderRadius: '50%',
                background: isDark ? 'rgba(35,229,219,0.03)' : 'rgba(14,165,233,0.05)',
                pointerEvents: 'none',
                filter: 'blur(100px)',
                zIndex: 0
              }} />
              <div style={{
                position: 'absolute', top: '1200px', left: '-200px',
                width: '700px', height: '700px', borderRadius: '50%',
                background: isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.05)',
                pointerEvents: 'none',
                filter: 'blur(120px)',
                zIndex: 0
              }} />
              <div style={{
                position: 'absolute', top: '2600px', right: '-250px',
                width: '800px', height: '800px', borderRadius: '50%',
                background: isDark ? 'rgba(35,229,219,0.02)' : 'rgba(14,165,233,0.04)',
                pointerEvents: 'none',
                filter: 'blur(150px)',
                zIndex: 0
              }} />
              <div style={{
                position: 'absolute', bottom: '200px', left: '-150px',
                width: '500px', height: '500px', borderRadius: '50%',
                background: isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.04)',
                pointerEvents: 'none',
                filter: 'blur(90px)',
                zIndex: 0
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <Navbar
                  user={user}
                  onOpenLogin={openLoginModal}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedCollege={selectedCollege}
                  onCollegeChange={setSelectedCollege}
                  onSearchSubmit={() => {}}
                />
                <CategoryTabs selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                <Hero />
                <CategoriesSection />
                <HowItWorks />
                <ProductsSection user={user} onOpenLogin={openLoginModal} selectedCategory={selectedCategory} selectedCollege={selectedCollege} searchQuery={searchQuery} />
                <FreshRecommendations ref={freshRecommendationsRef} selectedCategory={selectedCategory} selectedCollege={selectedCollege} />
                <WhyChooseUs />
                <Footer />
              </div>
            </div>
          }
        />
        <Route
          path="/product/:productId"
          element={<ProductDetailsPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/category/:categoryName"
          element={<CategoryPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/college/:collegeName"
          element={<CollegeDetailsPage
            user={user}
            onOpenLogin={openLoginModal}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCollege={selectedCollege}
            setSelectedCollege={setSelectedCollege}
            onCollegeChange={setSelectedCollege}
            onSearchSubmit={() => {}}
          />}
        />
        <Route
          path="/sell"
          element={<SellPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/about"
          element={<AboutPage user={user} onOpenLogin={openLoginModal} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} searchQuery="" setSearchQuery={() => {}} selectedCollege="" onCollegeChange={() => {}} onSearchSubmit={() => {}} />}
        />
        <Route
          path="/blog"
          element={<BlogPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/blog/:postId"
          element={<BlogPostDetail user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/careers"
          element={<CareersPage user={user} onOpenLogin={openLoginModal} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} searchQuery="" setSearchQuery={() => {}} selectedCollege="" onCollegeChange={() => {}} onSearchSubmit={() => {}} />}
        />
        <Route
          path="/profile"
          element={
            user ? (
              <ProfilePage user={user} onLogout={handleLogout} onOpenLogin={openLoginModal} />
            ) : (
              <>
                <Navbar user={user} onOpenLogin={openLoginModal} />
                <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: '60vh' }}>
                  <h2>Please log in to view your profile</h2>
                  <button
                    onClick={openLoginModal}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '20px',
                      fontSize: '16px'
                    }}
                  >
                    Login
                  </button>
                </div>
                <Footer />
              </>
            )
          }
        />
        <Route
          path="/favorites"
          element={
            user ? (
              <FavoritesPage user={user} onOpenLogin={openLoginModal} />
            ) : (
              <>
                <Navbar user={user} onOpenLogin={openLoginModal} />
                <div style={{ textAlign: 'center', padding: '60px 20px', minHeight: '60vh' }}>
                  <h2>Please log in to view your favorites</h2>
                  <button
                    onClick={openLoginModal}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '20px',
                      fontSize: '16px'
                    }}
                  >
                    Login
                  </button>
                </div>
                <Footer />
              </>
            )
          }
        />
        <Route
          path="/chats"
          element={<ChatPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/search"
          element={<SearchResultsPage
            user={user}
            onOpenLogin={openLoginModal}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCollege={selectedCollege}
            onCollegeChange={setSelectedCollege}
            onSearchSubmit={() => {}}
          />}
        />
        <Route
          path="/sitemap"
          element={<SitemapPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/legal-privacy"
          element={<LegalPrivacyPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicyPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/terms-of-use"
          element={<TermsOfUsePage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/privacy-policy/previous"
          element={<PrevPrivacyPolicyPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/terms-of-use/previous"
          element={<PrevTermsPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/help-center"
          element={<HelpCenter user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/help-center/law-enforcement"
          element={<HelpArticlePage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/faq"
          element={<FAQPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/verify-email/:token"
          element={<VerifyEmailPage user={user} onOpenLogin={openLoginModal} />}
        />
        <Route
          path="/contact"
          element={<ContactPage user={user} onOpenLogin={openLoginModal} />}
        />

        {/* Admin panel routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="coins" element={<AdminCoins />} />
          <Route path="colleges" element={<AdminColleges />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="access-control" element={<AdminAccessControl />} />
        </Route>
      </Routes>

      {showLoginModal && (
        <LoginModal onClose={closeLoginModal} onLogin={handleLogin} />
      )}
    </div>
  )
}

export default function App() {
  // Only wrap with GoogleOAuthProvider if a valid Client ID is configured
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.trim() !== '') {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AppContent />
      </GoogleOAuthProvider>
    )
  }
  
  // If no Client ID, render without GoogleOAuthProvider (Google login will be disabled)
  return <AppContent />
}
