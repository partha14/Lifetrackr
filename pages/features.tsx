import React from 'react'
import Layout from '../components/Layout'
import styles from '../styles/StaticPages.module.css'
import { FaShoppingCart, FaClipboardList, FaBrain, FaChartLine } from 'react-icons/fa'

export default function Features() {
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>LifeTrackr Features</h1>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FaShoppingCart />
            </div>
            <h2>Purchase Tracking</h2>
            <p>Easily log and categorize your purchases. Keep track of warranty periods and never miss a return deadline.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FaClipboardList />
            </div>
            <h2>Chore Management</h2>
            <p>Create, schedule, and manage your household tasks and maintenance chores. Set up recurring tasks and get reminders.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FaBrain />
            </div>
            <h2>Smart Reminders</h2>
            <p>Receive intelligent reminders for upcoming tasks, expiring warranties, and important dates related to your purchases and chores.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FaChartLine />
            </div>
            <h2>Insights and Analytics</h2>
            <p>Gain valuable insights into your spending habits and task completion patterns with our intuitive analytics dashboard.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
