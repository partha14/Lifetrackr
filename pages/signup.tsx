import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase, emailConfirmationEnabled } from '../utils/supabaseClient'
import styles from '../styles/Auth.module.css'
import { handleError } from '../utils/errorHandler'
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'

export default function SignUp() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email address')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      if (error) throw error
      if (data) {
        if (emailConfirmationEnabled) {
          alert('Check your email for the confirmation link!')
        } else {
          alert('Sign up successful! You can now log in.')
        }
        router.push('/login')
      }
    } catch (error) {
      handleError(error, 'An error occurred during sign up')
      setError(error.message || 'An unexpected error occurred')
    }
  }

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>LifeTrackr <span className={styles.beta}>BETA</span></Link>
      </nav>
      <div className={styles.authContainer}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Sign Up</h1>
          <form onSubmit={handleSignUp} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Full Name"
                className={styles.authInput}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Email"
                className={styles.authInput}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <FaLock className={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Password"
                className={styles.authInput}
                required
              />
            </div>
            <button type="submit" className={styles.authButton}>Sign Up</button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
          <p className={styles.loginPrompt}>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

