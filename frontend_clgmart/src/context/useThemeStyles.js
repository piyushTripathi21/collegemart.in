import { useTheme } from './ThemeContext'

export function useThemeStyles() {
  const { theme } = useTheme()

  const dark   = theme === 'dark'
  const ocean  = theme === 'ocean'
  const sunset = theme === 'sunset'

  return {
    theme,
    isDark: dark,

    pageBg:      dark ? '#0d1117'  : ocean ? '#e8f4fd'  : sunset ? '#fff3e8'  : '#f2f4f5',
    navbarBg:    dark ? '#161b27'  : '#ffffff',
    cardBg:      dark ? '#1e2235'  : '#ffffff',
    cardBg2:     dark ? '#252836'  : '#f8fafc',
    imageBg:     dark ? '#252836'  : '#f0f0f0',
    inputBg:     dark ? '#252836'  : '#ffffff',
    overlayBg:   dark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',

    textPrimary: dark ? '#e8eaf0'  : ocean ? '#0a3d62'  : sunset ? '#6b2d0e'  : '#002f34',
    textMuted:   dark ? '#8892a4'  : ocean ? '#5d82a0'  : sunset ? '#a06040'  : '#888888',
    textHeading: dark ? '#f0f2f8'  : '#111111',

    borderColor: dark ? '#2e3347'  : ocean ? '#b3d4f0'  : sunset ? '#f0cba8'  : '#e0e0e0',
    borderLight: dark ? '#252836'  : '#f0f0f0',

    accent:      dark ? '#23e5db'  : ocean ? '#1a73e8'  : sunset ? '#f97316'  : '#23e5db',

    btnPrimary:  dark ? '#23e5db'  : ocean ? '#1a73e8'  : sunset ? '#f97316'  : '#23e5db',
    btnPrimaryText: dark ? '#0d1117' : '#ffffff',

    cardShadow:  dark
      ? '0 2px 12px rgba(0,0,0,0.45)'
      : '0 2px 12px rgba(15,23,42,0.08)',
    cardShadowHover: dark
      ? '0 8px 30px rgba(0,0,0,0.6)'
      : '0 8px 30px rgba(15,23,42,0.15)',

    footerBg:    dark ? '#0d1117'  : '#f2f4f5',
    footerBottomBg: dark ? '#090c12' : '#002f34',
  }
}
