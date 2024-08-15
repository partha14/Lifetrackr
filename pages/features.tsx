import React from 'react'
import Layout from '../components/Layout'
import styles from '../styles/StaticPages.module.css'
import { FaShoppingCart, FaClipboardList, FaBrain, FaChartLine, FaSearch, FaRobot, FaComments } from 'react-icons/fa'
import Image from 'next/image'

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
        
        <h2 className={styles.upcomingTitle}>Coming Soon</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FaSearch />
            </div>
            <h2>Advanced Search</h2>
            <p>Powerful search functionality to quickly find any purchase or chore in your records.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FaComments />
            </div>
            <h2>Natural Language Search</h2>
            <p>Search for purchases like appliances or automobiles using natural language queries.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FaRobot />
            </div>
            <h2>AI-Powered Chore Assistance</h2>
            <p>Utilize AI agents to help perform and manage some of your chores automatically.</p>
          </div>
        </div>
      </div>
      <div className={styles.screenshotContainer}>
        <h2>User Interface Preview</h2>
        <Image
          src="/UI-screenshot.png"
          alt="LifeTrackr User Interface"
          width={600}
          height={400}
          layout="responsive"
        />
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2023 LifeTrackr. All rights reserved. | We will never sell your data.</p>
        </div>
      </footer>
    </Layout>
  )
}
