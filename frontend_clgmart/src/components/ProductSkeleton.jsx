import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ProductSkeleton({ count = 6 }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const shimmerBg = isDark ? '#1e293b' : '#e2e8f0'
  const baseBg = isDark ? '#0f172a' : '#f1f5f9'

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="product-card"
          style={{
            overflow: 'hidden',
            animation: `skeleton-pulse 1.5s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`
          }}
        >
          {/* Image skeleton */}
          <div style={{
            width: '100%',
            height: '200px',
            background: `linear-gradient(90deg, ${baseBg} 25%, ${shimmerBg} 50%, ${baseBg} 75%)`,
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
            borderRadius: '8px 8px 0 0'
          }} />

          {/* Content skeleton */}
          <div style={{ padding: '16px' }}>
            {/* Price */}
            <div style={{
              width: '80px',
              height: '22px',
              borderRadius: '4px',
              background: `linear-gradient(90deg, ${baseBg} 25%, ${shimmerBg} 50%, ${baseBg} 75%)`,
              backgroundSize: '200% 100%',
              animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
              marginBottom: '10px'
            }} />

            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <div style={{
                width: '60px',
                height: '20px',
                borderRadius: '4px',
                background: `linear-gradient(90deg, ${baseBg} 25%, ${shimmerBg} 50%, ${baseBg} 75%)`,
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
              }} />
              <div style={{
                width: '72px',
                height: '20px',
                borderRadius: '4px',
                background: `linear-gradient(90deg, ${baseBg} 25%, ${shimmerBg} 50%, ${baseBg} 75%)`,
                backgroundSize: '200% 100%',
                animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
              }} />
            </div>

            {/* Title */}
            <div style={{
              width: '90%',
              height: '16px',
              borderRadius: '4px',
              background: `linear-gradient(90deg, ${baseBg} 25%, ${shimmerBg} 50%, ${baseBg} 75%)`,
              backgroundSize: '200% 100%',
              animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
              marginBottom: '8px'
            }} />
            <div style={{
              width: '65%',
              height: '14px',
              borderRadius: '4px',
              background: `linear-gradient(90deg, ${baseBg} 25%, ${shimmerBg} 50%, ${baseBg} 75%)`,
              backgroundSize: '200% 100%',
              animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
            }} />
          </div>

          <style>{`
            @keyframes skeleton-shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            @keyframes skeleton-pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
          `}</style>
        </div>
      ))}
    </>
  )
}
