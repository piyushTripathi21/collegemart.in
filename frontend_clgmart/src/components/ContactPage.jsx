import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ContactPage({ user, onOpenLogin }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-gradient)', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} onOpenLogin={onOpenLogin} />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{
          width: '100%',
          maxWidth: '560px',
        }}>

          {}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(35,229,219,0.12)',
              border: '1.5px solid rgba(35,229,219,0.3)',
              marginBottom: '20px',
            }}>
              <img
                src="/contact-phone-icon.png"
                alt="Contact"
                style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'invert(56%) sepia(70%) saturate(400%) hue-rotate(140deg)' }}
              />
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: '0 0 10px 0',
              letterSpacing: '-0.5px',
            }}>
              Contact Us
            </h1>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-muted)',
              margin: 0,
              lineHeight: '1.6',
            }}>
              Have a question or need help? Reach us directly — we're happy to assist.
            </p>
          </div>

          {}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {}
            <a
              href="tel:+919755609882"
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '24px 28px',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#23e5db'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(35,229,219,0.15)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)'
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(35,229,219,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <img
                    src="/contact-phone-icon.png"
                    alt="Phone"
                    style={{ width: '26px', height: '26px', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#23e5db',
                    marginBottom: '4px',
                  }}>
                    Phone
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    letterSpacing: '0.5px',
                  }}>
                    +91 97556 09882
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                  }}>
                    Tap to call
                  </div>
                </div>
              </div>
            </a>

            {}
            <a
              href="mailto:collegemart.dev@gmail.com"
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '24px 28px',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#23e5db'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(35,229,219,0.15)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)'
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(35,229,219,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <img
                    src="/contact-chat-icon.png"
                    alt="Email"
                    style={{ width: '26px', height: '26px', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#23e5db',
                    marginBottom: '4px',
                  }}>
                    Email
                  </div>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    wordBreak: 'break-all',
                  }}>
                    collegemart.dev@gmail.com
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                  }}>
                    Tap to send email
                  </div>
                </div>
              </div>
            </a>

          </div>

          {}
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link
              to="/help-center"
              style={{
                fontSize: '13px',
                color: '#23e5db',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              ← Back to Help Center
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
