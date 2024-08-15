import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/Dashboard.module.css'
import { FaTachometerAlt, FaClipboardList, FaShoppingCart, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import { supabase } from '../utils/supabaseClient'
import { handleError } from '../utils/errorHandler'
import DarkModeToggle from './DarkModeToggle'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { useTheme } from 'next-themes'
import { Analytics } from "@vercel/analytics/react"
import Head from 'next/head'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoggedIn, loading } = useIsLoggedIn()
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

  const renderNavLinks = () => {
    if (loading) {
      return <div>Loading...</div>
    }

    if (isLoggedIn) {
      return (
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
      )
    }

    return (
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
    )
  }

  return (
    <div className={`${styles.container} ${styles.root}`}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
      </Head>
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href={isLoggedIn ? "/dashboard" : "/"} className={styles.logo}>
            LifeTrackr <span className={styles.beta}>BETA</span>
          </Link>
          <button className={styles.closeMobileMenu} onClick={() => setIsMobileMenuOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <nav>
          {renderNavLinks()}
        </nav>
      </aside>
      <div className={styles.mainWrapper}>
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
          <div className={styles.content}>
            {children}
          </div>
        </main>
        <footer className={styles.footer}>
          <p>&copy; 2023 LifeTrackr. All rights reserved.</p>
          <p className={styles.madeBy}>Made with ❤️ by SKP</p>
        </footer>
      </div>
      {isMobileMenuOpen && <div className={styles.overlay} onClick={() => setIsMobileMenuOpen(false)}></div>}
      <Analytics />
    </div>
  )
}

export default Layout
