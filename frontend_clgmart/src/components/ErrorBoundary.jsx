import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '20px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            backgroundColor: 'white',
            padding: '48px 40px',
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <img src="/error-illustration.png" alt="Error" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 12px 0'
            }}>
              Something went wrong
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#64748b',
              lineHeight: '1.6',
              margin: '0 0 32px 0'
            }}>
              An unexpected error occurred. Don't worry — your data is safe. Try reloading the page or going back to the home page.
            </p>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details style={{
                textAlign: 'left',
                marginBottom: '24px',
                padding: '12px 16px',
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                fontSize: '13px',
                color: '#991b1b'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '8px' }}>
                  Error Details
                </summary>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                  fontFamily: 'monospace'
                }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={e => e.target.style.backgroundColor = '#0284c7'}
                onMouseLeave={e => e.target.style.backgroundColor = '#0ea5e9'}
              >
                <img 
                  src="/reload-icon.png" 
                  alt="" 
                  style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }} 
                />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={e => e.target.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => e.target.style.backgroundColor = 'white'}
              >
                <img 
                  src="/home-icon.png" 
                  alt="" 
                  style={{ width: '16px', height: '16px' }} 
                />
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
