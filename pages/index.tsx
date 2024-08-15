import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { FaShoppingCart, FaClipboardList, FaBrain, FaCalendarAlt, FaDollarSign, FaReceipt, FaEnvelope, FaFileAlt, FaRobot } from 'react-icons/fa';
import React from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#4a90e2" />
      </Head>

      <main className={styles.main}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            LifeTrackr <span className={styles.beta}>BETA</span>
            <span className={styles.srOnly}>Home</span>
          </Link>
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
          <motion.h1 key="title1" variants={fadeInUp}>Tired of juggling life's endless tasks?</motion.h1>
          <motion.h1 key="title2" variants={fadeInUp}>Meet LifeTrackr: Your Personal Life Assistant</motion.h1>
          <motion.div className={styles.heroText} variants={fadeInUp}>
            {`Effortlessly organize your life, from chores to purchases. LifeTrackr remembers so you don't have to. Experience the freedom of a well-managed life with our innovative app, now in beta!`.split(' ').map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.25,
                  delay: i / 10
                }}
                style={{ display: 'inline-block', marginRight: '4px' }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
          <motion.div variants={fadeInUp}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link href="/signup" className={styles.ctaButton}>Join the Beta</Link>
            </motion.div>
          </motion.div>
        </motion.section>

        <section className={styles.features}>
          {[
            {
              icon: <FaShoppingCart className={styles.featureIcon} />,
              title: "Track Purchases",
              description: "Never forget warranty periods or when you bought something.",
              example: "Example: MacBook Pro - 1 year warranty (expires in 8 months)",
              emoji: "🛍️"
            },
            {
              icon: <FaClipboardList className={styles.featureIcon} />,
              title: "✅ Manage Chores",
              description: "Keep track of important home and vehicle maintenance tasks.",
              example: (
                <>
                  <strong>Examples:</strong>
                  <ul>
                    <li>Change car tires (every 6 months)</li>
                    <li>Replace air filters (every 3 months)</li>
                    <li>Oil change (every 5000 miles)</li>
                  </ul>
                </>
              )
            },
            {
              icon: <FaBrain className={styles.featureIcon} />,
              title: "🧘 Peace of Mind",
              description: "Free up mental space and never worry about forgetting important tasks."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={styles.feature}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {feature.icon}
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
              {feature.example && (
                <div className={styles.example}>
                  {feature.example}
                </div>
              )}
            </motion.div>
          ))}
        </section>

        <motion.section 
          className={styles.aiShowcase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Experience the Power of AI (Coming Soon!)
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            Soon, you'll be able to ask LifeTrackr anything about your home, car, or personal tasks:
          </motion.p>
          <motion.div 
            className={styles.aiExamples}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  delayChildren: 1,
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            <motion.div 
              className={styles.aiExample}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <FaRobot className={styles.aiIcon} />
              <div className={styles.aiChatbox}>
                <div className={styles.staticTextBox}>
                  <TypingEffect
                    texts={[
                      "When is my next car service appointment?",
                      "What's the expiration date of my home insurance policy?",
                      "How many days until my next dentist check-up?",
                      "When should I replace the batteries in my smoke detectors?",
                      "What's the remaining warranty period on my laptop?",
                      "When is the next scheduled termite inspection?",
                      "How long has it been since I last serviced my boiler?",
                      "When do I need to renew my driver's license?",
                      "What's the due date for my next credit card payment?"
                    ]}
                    typingSpeed={65}
                    eraseSpeed={35}
                    eraseDelay={2700}
                    typeDelay={650}
                    aria-label="AI assistant example questions"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            LifeTrackr's upcoming AI assistant will help you stay on top of your tasks and maintenance schedules effortlessly.
          </motion.p>
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
