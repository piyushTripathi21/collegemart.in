import React, { useEffect, useState } from 'react'

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('enter') // 'enter' | 'visible' | 'exit'

  useEffect(() => {
    // Phase 1: logo fades + scales in (600ms)
    const visibleTimer = setTimeout(() => setPhase('visible'), 600)

    // Phase 2: start exit fade after 2.2s total
    const exitTimer = setTimeout(() => setPhase('exit'), 2200)

    // Phase 3: fully done, unmount after exit animation (500ms)
    const doneTimer = setTimeout(() => onFinish(), 2700)

    return () => {
      clearTimeout(visibleTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onFinish])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #0a8a84 0%, #0fb8b1 45%, #17cec7 100%)',
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.5s ease' : 'none',
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      {/* Ambient glow blobs – soft white on teal */}
      <div style={{
        position: 'absolute', top: '15%', left: '15%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        filter: 'blur(90px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '15%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'rgba(0,47,52,0.07)',
        filter: 'blur(100px)', pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          transform: phase === 'enter' ? 'scale(0.7) translateY(20px)' : 'scale(1) translateY(0)',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease',
        }}
      >
        {/* Logo image – circular white container */}
        <div style={{
          position: 'relative',
          width: '130px',
          height: '130px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Pulsing rings – dark on teal */}
          <div style={{
            position: 'absolute',
            inset: '-14px',
            borderRadius: '50%',
            border: '2px solid rgba(0,47,52,0.2)',
            animation: 'splash-ring-pulse 1.8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: '-28px',
            borderRadius: '50%',
            border: '1px solid rgba(0,47,52,0.1)',
            animation: 'splash-ring-pulse 1.8s ease-in-out infinite 0.3s',
          }} />

          {/* Circular white background behind logo */}
          <div style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0,47,52,0.18), 0 2px 8px rgba(0,47,52,0.12)',
            overflow: 'hidden',
          }}>
            <img
              src="/collegemart_logo.png"
              alt="CollegeMart"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>

        {/* Brand name */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '800',
            letterSpacing: '2px',
            lineHeight: 1,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            <span style={{ color: '#002f34' }}>College</span>
            <span style={{
              color: '#ffffff',
              textShadow: '0 2px 12px rgba(0,47,52,0.25)',
            }}>Mart</span>
          </div>
          <div style={{
            marginTop: '8px',
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'rgba(0,47,52,0.65)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Buy · Sell · Trade on Campus
          </div>
        </div>
      </div>

      {/* Loading dots */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        display: 'flex',
        gap: '8px',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.6s ease 0.4s',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#002f34',
            animation: `splash-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            opacity: 0.6,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes splash-ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.2; }
        }
        @keyframes splash-dot-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
