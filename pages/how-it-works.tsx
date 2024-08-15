import React from 'react'
import Layout from '../components/Layout'
import styles from '../styles/StaticPages.module.css'

export default function HowItWorks() {
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>How It Works</h1>
        <div className={styles.content}>
          <h2>Track Your Purchases</h2>
          <p>Easily log and categorize your purchases to keep track of your spending habits.</p>
          
          <h2>Manage Your Chores</h2>
          <p>Create and schedule chores to stay on top of your household tasks.</p>
          
          <h2>Dashboard Overview</h2>
          <p>Get a quick glance at your recent activities and upcoming tasks on your personalized dashboard.</p>
          
          <h2>Secure and Private</h2>
          <p>Your data is encrypted and securely stored, ensuring your privacy at all times.</p>
        </div>
      </div>
    </Layout>
  )
}
