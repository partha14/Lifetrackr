import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { FaShoppingCart, FaClipboardList, FaBrain, FaCalendarAlt, FaDollarSign, FaReceipt, FaEnvelope, FaFileAlt, FaRobot } from 'react-icons/fa';
import React from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypingEffect from '../components/TypingEffect';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    console.log('Home component mounted');
    // Add any initialization code here
  }, []);

  const handleError = (error: Error) => {
    console.error('An error occurred:', error);
    // You can add more error handling logic here
  };

  if (!isClient) {
    return null; // or a loading indicator
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>LifeTrackr Beta - Organize Your Work and Life | Life Management App</title>
        <meta name="description" content="LifeTrackr Beta: The innovative life management app to simplify and organize your work and personal life. Track purchases, manage chores, and more. Join the beta now!" />
        <meta name="keywords" content="life management, organization, productivity, chores, purchases, beta app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="LifeTrackr Beta - Organize Your Work and Life" />
        <meta property="og:description" content="Simplify and organize your work and personal life with LifeTrackr Beta. Join now!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lifetrackr.com" />
        <meta property="og:image" content="https://lifetrackr.com/og-image.jpg" />
        <link rel="canonical" href="https://lifetrackr.com" />
        <link rel="icon" href="/public/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/public/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/public/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/public/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <main className={styles.main}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>LifeTrackr <span className={styles.beta}>BETA</span></Link>
          <div className={styles.navLinks}>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/features">Features</Link>
          </div>
          <div className={styles.authLinks}>
            <Link href="/login" className={styles.loginButton}>Log in</Link>
            <Link href="/signup" className={styles.signupButton}>Start for free</Link>
          </div>
        </nav>

        <motion.section 
          className={styles.hero}
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.h1 variants={fadeInUp}>Tired of juggling life's endless tasks?</motion.h1>
          <motion.h1 variants={fadeInUp}>Meet LifeTrackr: Your Personal Life Assistant</motion.h1>
          <motion.p variants={fadeInUp}>
            Effortlessly organize your life, from chores to purchases. LifeTrackr remembers so you don't have to. Experience the freedom of a well-managed life with our innovative app, now in beta!
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link href="/signup" className={styles.ctaButton}>Join the Beta</Link>
          </motion.div>
        </motion.section>

        <section className={styles.features}>
          <div className={styles.feature}>
            <FaShoppingCart className={styles.featureIcon} />
            <h2>🛍️ Track Purchases</h2>
            <p>Never forget warranty periods or when you bought something.</p>
            <div className={styles.example}>
              <strong>Example:</strong> MacBook Pro - 1 year warranty (expires in 8 months)
            </div>
          </div>
          <div className={styles.feature}>
            <FaClipboardList className={styles.featureIcon} />
            <h2>✅ Manage Chores</h2>
            <p>Keep track of important home and vehicle maintenance tasks.</p>
            <div className={styles.example}>
              <strong>Examples:</strong>
              <ul>
                <li>Change car tires (every 6 months)</li>
                <li>Replace air filters (every 3 months)</li>
                <li>Oil change (every 5000 miles)</li>
              </ul>
            </div>
          </div>
          <div className={styles.feature}>
            <FaBrain className={styles.featureIcon} />
            <h2>🧘 Peace of Mind</h2>
            <p>Free up mental space and never worry about forgetting important tasks.</p>
          </div>
        </section>

        <motion.section 
          className={styles.aiShowcase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2>Experience the Power of AI</h2>
          <p>Ask LifeTrackr anything about your home, car, or personal tasks:</p>
          <div className={styles.aiExamples}>
            <div className={styles.aiExample}>
              <FaRobot className={styles.aiIcon} />
              <TypingEffect
                texts={[
                  "When do I need to replace the air filter in my refrigerator?",
                  "What's the recommended oil type for my next car oil change?",
                  "When was the last time I scheduled pest control for my home?"
                ]}
                typingSpeed={50}
                eraseSpeed={30}
                eraseDelay={3000}
                typeDelay={1000}
              />
            </div>
          </div>
          <p>LifeTrackr's AI assistant helps you stay on top of your tasks and maintenance schedules effortlessly.</p>
        </motion.section>

        <section className={styles.benefits}>
          <h2>How LifeTrackr Saves You Time and Effort</h2>
          <ul>
            <li>Automatic reminders for warranty expirations and recurring chores</li>
            <li>Quick access to purchase history for returns or repairs</li>
            <li>Optimize vehicle maintenance schedules to extend lifespan</li>
            <li>Reduce stress by offloading mental tasks to our reliable system</li>
            <li>Save money by never missing a warranty claim or important maintenance</li>
            <li>Automatic data entry by scanning receipts (Coming Soon!)</li>
            <li>Email notifications for high-priority chores due this week (Coming Soon!)</li>
          </ul>
        </section>

        <section className={styles.upcomingFeatures}>
          <h2>Exciting Features Coming Soon!</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <FaReceipt className={styles.featureIcon} />
              <h3>📷 Receipt Scanning</h3>
              <p>Automatically enter purchase data by simply scanning your receipts.</p>
            </div>
            <div className={styles.featureCard}>
              <FaFileAlt className={styles.featureIcon} />
              <h3>📚 Instruction Manual Upload</h3>
              <p>Upload and store all your appliance instruction manuals for easy access.</p>
            </div>
            <div className={styles.featureCard}>
              <FaRobot className={styles.featureIcon} />
              <h3>🤖 AI-Powered Chat Assistant</h3>
              <p>Ask questions about your purchases, chores, and more using natural language.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Never Forget Another Important Task</h2>
          <p>Join LifeTrackr Beta today and experience the peace of mind that comes with perfect organization!</p>
          <Link href="/signup" className={styles.ctaButton}>Join the Beta for Free</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2023 LifeTrackr. All rights reserved. | We will never sell your data.</p>
      </footer>
    </div>
  );
}
