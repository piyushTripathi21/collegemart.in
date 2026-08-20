import React, { createContext, useContext, useState, useEffect } from 'react'

export const themes = {
  light: {
    name: 'Light',
    icon: (
      <svg
        width="1.1em"
        height="1.1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M6.34 17.66l-1.41 1.41" />
        <path d="M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
    label: 'Light',
  },
  dark: {
    name: 'Dark',
    icon: (
      <svg
        width="1.1em"
        height="1.1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
    label: 'Dark',
  },
}

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  themes,
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('collegemart-theme')
    return (saved === 'light' || saved === 'dark') ? saved : 'light'
  })

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    localStorage.setItem('collegemart-theme', newTheme)
  }

  useEffect(() => {

    document.documentElement.removeAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
