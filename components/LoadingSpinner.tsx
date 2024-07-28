import React from 'react'
import styles from '../styles/LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  children?: React.ReactNode;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ children }) => {
  return (
    <div className={styles['spinnerContainer']}>
      <div className={styles['spinner']}></div>
      {children}
    </div>
  )
}

export default LoadingSpinner
