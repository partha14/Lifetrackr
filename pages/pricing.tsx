import React from 'react'
import Layout from '../components/Layout'
import styles from '../styles/StaticPages.module.css'

export default function Pricing() {
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Pricing</h1>
        <div className={styles.content}>
          <div className={styles.pricingTier}>
            <h2>Free Tier</h2>
            <ul>
              <li>Basic purchase tracking</li>
              <li>Simple chore management</li>
              <li>Limited dashboard features</li>
            </ul>
            <p className={styles.price}>$0/month</p>
          </div>
          
          <div className={styles.pricingTier}>
            <h2>Premium Tier</h2>
            <ul>
              <li>Advanced purchase analytics</li>
              <li>Unlimited chore scheduling</li>
              <li>Full dashboard customization</li>
              <li>Priority support</li>
            </ul>
            <p className={styles.price}>$9.99/month</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
