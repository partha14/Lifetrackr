import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import styles from '../styles/Form.module.css'
import { supabase } from '../utils/supabaseClient'
import { handleError } from '../utils/errorHandler'
import { toast, Toaster } from 'react-hot-toast'

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('feedback')
        .insert([{ user_id: user.id, content: feedback }])
        .select()

      if (error) throw error

      console.log('Feedback submitted:', data)
      toast.success('Feedback submitted successfully!', {
        duration: 3000,
        position: 'top-center',
      })
      setFeedback('')
      // Add a delay before redirecting to ensure the toast is visible
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      handleError(error, 'Failed to submit feedback')
    }
  }

  return (
    <Layout>
      <Toaster position="top-center" />
      <div className={styles.formContainer}>
        <h1>Provide Feedback</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback here..."
            required
            className={styles.textarea}
            maxLength={1000}
          />
          <div className={styles.characterCount}>
            {feedback.length}/1000 characters
          </div>
          <button type="submit" className={styles.button}>Submit Feedback</button>
        </form>
      </div>
    </Layout>
  )
}

export default FeedbackForm
