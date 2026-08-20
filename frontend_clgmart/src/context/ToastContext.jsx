import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type, duration }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
    return id
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

const TOAST_STYLES = {
  success: { bg: '#059669', icon: '✓', border: '#34d399' },
  error: { bg: '#dc2626', icon: '✕', border: '#f87171' },
  warning: { bg: '#d97706', icon: '⚠', border: '#fbbf24' },
  info: { bg: '#0284c7', icon: 'ℹ', border: '#38bdf8' }
}

function ToastItem({ toast, onDismiss }) {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info
  const [exiting, setExiting] = React.useState(false)

  React.useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), toast.duration - 300)
    return () => clearTimeout(exitTimer)
  }, [toast.duration])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '12px',
        backgroundColor: style.bg,
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.4',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        border: `1px solid ${style.border}`,
        pointerEvents: 'auto',
        cursor: 'pointer',
        animation: exiting ? 'toast-exit 0.3s ease forwards' : 'toast-enter 0.3s ease forwards',
        backdropFilter: 'blur(8px)',
        transform: 'translateX(0)'
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <span style={{
        fontSize: '18px',
        fontWeight: '700',
        flexShrink: 0,
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {style.icon}
      </span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(toast.id) }}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0 4px',
          lineHeight: 1,
          flexShrink: 0
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes toast-enter {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toast-exit {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100px); }
        }
      `}</style>
    </div>
  )
}
