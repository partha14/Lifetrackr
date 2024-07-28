import React from 'react'
import { useTheme } from 'next-themes'
import styles from '../styles/DarkModeToggle.module.css'
import { FaSun, FaMoon } from 'react-icons/fa'

const DarkModeToggle: React.FC = () => {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      className={styles.toggleButton}
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {resolvedTheme === 'dark' ? <FaSun /> : <FaMoon />}
    </button>
  )
}

export default DarkModeToggle
