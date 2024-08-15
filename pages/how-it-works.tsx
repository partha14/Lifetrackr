import React from 'react'
import Layout from '../components/Layout'
import styles from '../styles/StaticPages.module.css'
import { FaUserPlus, FaShoppingCart, FaClipboardList, FaTachometerAlt, FaBell, FaLock } from 'react-icons/fa'

export default function HowItWorks() {
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>How LifeTrackr Works</h1>
        <div className={styles.howItWorksContent}>
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <FaUserPlus />
            </div>
            <h2>1. Sign Up</h2>
            <p>Create your free account to get started with LifeTrackr.</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <FaShoppingCart />
            </div>
            <h2>2. Track Your Purchases</h2>
            <p>Log your purchases, including details like price, date, and warranty information. Easily categorize and search through your purchase history.</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <FaClipboardList />
            </div>
            <h2>3. Manage Your Chores</h2>
            <p>Create and schedule one-time or recurring chores. Set due dates and priorities to stay on top of your household tasks.</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <FaTachometerAlt />
            </div>
            <h2>4. Use Your Dashboard</h2>
            <p>Access your personalized dashboard for a quick overview of recent activities, upcoming tasks, and important reminders.</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <FaBell />
            </div>
            <h2>5. Receive Smart Reminders</h2>
            <p>Get timely notifications for upcoming chores, expiring warranties, and other important dates related to your purchases and tasks.</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <FaLock />
            </div>
            <h2>6. Enjoy Security and Privacy</h2>
            <p>Rest easy knowing your data is encrypted and securely stored, ensuring your privacy at all times.</p>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <p>© 2023 LifeTrackr. All rights reserved. | We will never sell your data.</p>
      </footer>
    </Layout>
  )
}
