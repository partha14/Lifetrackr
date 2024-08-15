import React, { useState } from 'react'
import Layout from '../components/Layout'
import styles from '../styles/StaticPages.module.css'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this data to your backend or a third-party service
    console.log('Form submitted:', { name, email, message })
    alert('Thank you for your message. We will get back to you soon!')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Contact Us</h1>
        <div className={styles.contactInfo}>
          <div className={styles.infoItem}>
            <FaEnvelope className={styles.icon} />
            <p>support@lifetrackr.com</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your Name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="How can we help you?"
            ></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>Send Message</button>
        </form>
      </div>
    </Layout>
  )
}
