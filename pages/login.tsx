import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { toast, Toaster } from 'react-hot-toast'
import styles from '../styles/Auth.module.css'
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa'
import { handleError } from '../utils/errorHandler'

export default function Login() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) throw error

      const { data: { user } } = await supabase.auth.getUser()
      const userName = user?.user_metadata?.full_name || user?.email || 'User'

      toast.success('Logged in successfully!')
      router.push(`/dashboard?name=${encodeURIComponent(userName)}`)
    } catch (error) {
      handleError(error, 'An error occurred during login')
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer}>
      <Toaster position="top-center" reverseOrder={false} />
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>LifeTrackr <span className={styles.beta}>BETA</span></Link>
      </nav>
      <div className={styles.authContainer}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Welcome Back</h1>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleLogin} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className={styles.authInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <FaLock className={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className={styles.authInput}
              />
            </div>
            <button type="submit" disabled={isLoading} className={styles.authButton}>
              <FaSignInAlt className={styles.buttonIcon} />
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className={styles.signupPrompt}>
            Don't have an account? <Link href="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
