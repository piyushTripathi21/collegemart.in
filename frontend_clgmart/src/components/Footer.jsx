import React from 'react'
import { Link } from 'react-router-dom'

const facebookIcon = new URL('/facebook-icon.svg', import.meta.url).href
const instagramIcon = new URL('/instagram-icon.svg', import.meta.url).href
const youtubeIcon = new URL('/youtube-icon.svg', import.meta.url).href
const linkedinIcon = new URL('/linkedin-icon.svg', import.meta.url).href
const playStoreIcon = new URL('/play-store-icon.svg', import.meta.url).href
const appStoreIcon = new URL('/app-store-icon.svg', import.meta.url).href

const popularColleges = [
  { label: 'IIT Delhi', route: 'IIT Delhi' },
  { label: 'VIT Vellore', route: 'VIT Vellore' },
  { label: 'BITS Pilani', route: 'BITS Pilani' },
  { label: 'NIT Trichy', route: 'NIT Trichy' }
]

const trendingColleges = [
  { label: 'Manipal University', route: 'MAHE Manipal' },
  { label: 'Symbiosis Pune', route: 'SIU Pune' },
  { label: 'DU North Campus', route: 'DU New Delhi' },
  { label: 'Amity University', route: 'Amity Noida' }
]

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo(0, 0)
  }

  const handleCollegeClick = (college) => {
    // Save college to localStorage
    localStorage.setItem('selectedCollege', college.route)
    handleScrollToTop()
  }

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-column">
          <h4>POPULAR COLLEGES</h4>
          <ul>
            {popularColleges.map(college => (
              <li key={college.route}>
                <Link
                  to={`/college/${encodeURIComponent(college.route)}`}
                  onClick={() => handleCollegeClick(college)}
                >
                  {college.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4>TRENDING COLLEGES</h4>
          <ul>
            {trendingColleges.map(college => (
              <li key={college.route}>
                <Link
                  to={`/college/${encodeURIComponent(college.route)}`}
                  onClick={() => handleCollegeClick(college)}
                >
                  {college.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4>ABOUT US</h4>
          <ul>
            <li><Link to="/about">About CollegeMart</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>HELP</h4>
          <ul>
            <li><Link to="/help-center">Help Center</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/legal-privacy">Legal & Privacy</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>FOLLOW US</h4>
          <div className="social-icons">
            <a 
              href="https://www.instagram.com/collegemart.dev?utm_source=qr&igsh=MXVtdWpmejhwY2h2eQ%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon social-instagram"
            >
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a 
              href="https://x.com/CollegeMart1" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon social-x"
              style={{ textDecoration: 'none' }}
            >
              𝕏
            </a>
            <a 
              href="https://www.linkedin.com/company/collegemartofficial/about/?viewAsMember=true" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon social-linkedin"
            >
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
          </div>
          <div>
            <div className="app-badge">
              <img src={playStoreIcon} alt="Google Play" className="app-badge-icon" />
              Get it on Google Play
            </div>
            <div className="app-badge">
              <img src={appStoreIcon} alt="App Store" className="app-badge-icon" />
              Download on App Store
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <Link to="/" className="footer-bottom-logo" onClick={handleScrollToTop} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/collegemart_logo.png"
            alt="CollegeMart Logo"
            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
          />
          <span>College<span className="accent">Mart</span></span>
        </Link>
        <div className="footer-bottom-links">
          <Link to="/help-center">Help</Link>
          <span style={{ margin: '0 8px', color: '#6b7280' }}>·</span>
          <Link to="/faq">FAQs</Link>
        </div>
        <div className="footer-bottom-right">
          All rights reserved © 2024–2026 CollegeMart
        </div>
      </div>
    </footer>
  )
}
