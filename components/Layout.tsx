import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/Dashboard.module.css'
import { FaTachometerAlt, FaClipboardList, FaShoppingCart, FaSignOutAlt, FaBars } from 'react-icons/fa'
import { supabase } from '../utils/supabaseClient'
import { handleError } from '../utils/errorHandler'
import DarkModeToggle from './DarkModeToggle'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { useTheme } from 'next-themes'
import { Analytics } from "@vercel/analytics/react"

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoggedIn } = useIsLoggedIn()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [resolvedTheme])

  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])


  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
    } catch (error) {
      handleError(error, 'An error occurred during logout')
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className={`${styles.container} ${styles.root}`}>
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <Link href={isLoggedIn ? "/dashboard" : "/"} className={styles.logo}>
          LifeTrackr <span className={styles.beta}>BETA</span>
        </Link>
        <nav>
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className={`${styles.navLink} ${router.pathname === '/dashboard' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <FaTachometerAlt className={styles.icon} /> <span>Dashboard</span>
              </Link>
              <Link href="/chores" className={`${styles.navLink} ${router.pathname === '/chores' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <FaClipboardList className={styles.icon} /> <span>Chores</span>
              </Link>
              <Link href="/purchases" className={`${styles.navLink} ${router.pathname === '/purchases' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <FaShoppingCart className={styles.icon} /> <span>Purchases</span>
              </Link>
              <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutButton}`}>
                <FaSignOutAlt className={styles.icon} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/how-it-works" className={`${styles.navLink} ${router.pathname === '/how-it-works' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="/features" className={`${styles.navLink} ${router.pathname === '/features' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="/login" className={`${styles.navLink} ${router.pathname === '/login' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
              <Link href="/signup" className={`${styles.navLink} ${router.pathname === '/signup' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
            <FaBars />
          </button>
          <Link href={isLoggedIn ? "/dashboard" : "/"} className={styles.appNameMain}>
            LifeTrackr <span className={styles.beta}>BETA</span>
          </Link>
          <DarkModeToggle />
        </header>
        {children}
      </main>
      {isMobileMenuOpen && <div className={styles.overlay} onClick={() => setIsMobileMenuOpen(false)}></div>}
      <Analytics />
    </div>
  )
}

export default Layout
