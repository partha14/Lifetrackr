import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { FaShoppingCart, FaClipboardList, FaBrain, FaRobot } from 'react-icons/fa';
import TypingEffect from '../components/TypingEffect';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>LifeTrackr Beta - Organize Your Work and Life | Life Management App</title>
        <meta name="description" content="LifeTrackr Beta: The innovative life management app to simplify and organize your work and personal life. Track purchases, manage chores, and more. Join the beta now!" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            LifeTrackr <span className={styles.beta}>BETA</span>
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

        <section className={styles.hero}>
          <h1>Tired of juggling life's endless tasks?</h1>
          <h2>Meet LifeTrackr: Your Personal Life Assistant</h2>
          <p>Effortlessly organize your life, from chores to purchases.</p>
          <p>LifeTrackr remembers so you don't have to.</p>
          <p>Experience the freedom of a well-managed life with our innovative beta app!</p>
          <Link href="/signup" className={styles.ctaButton}>Join the Beta</Link>
        </section>

        <section className={styles.features}>
          <FeatureCard
            icon={<FaShoppingCart className={styles.featureIcon} />}
            title="Track Purchases"
            description="Never forget warranty periods or when you bought something."
          />
          <FeatureCard
            icon={<FaClipboardList className={styles.featureIcon} />}
            title="Manage Chores"
            description="Keep track of important home and vehicle maintenance tasks."
          />
          <FeatureCard
            icon={<FaBrain className={styles.featureIcon} />}
            title="Peace of Mind"
            description="Free up mental space and never worry about forgetting important tasks."
          />
        </section>

        <section className={styles.howItWorks}>
          <h2>How It Works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <h3>1. Add Your Chores</h3>
              <p>Choose from predefined categories or create custom chores.</p>
              <div className={styles.screenshotContainer}>
                <img src="/UI-screenshot.png" alt="Add Chore Interface" className={styles.stepImage} />
              </div>
            </div>
            <div className={styles.step}>
              <h3>2. Set Due Dates</h3>
              <p>Assign due dates to your chores to stay on track.</p>
            </div>
            <div className={styles.step}>
              <h3>3. Track Recurring Tasks</h3>
              <p>Set up recurring chores for regular maintenance tasks.</p>
            </div>
            <div className={styles.step}>
              <h3>4. Manage Your Purchases</h3>
              <p>Log your purchases and track your spending habits.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Never Forget Another Important Task</h2>
          <p>Join LifeTrackr Beta today and experience the peace of mind that comes with perfect organization!</p>
          <Link href="/signup" className={styles.ctaButton}>Join the Beta for Free</Link>
        </section>

        <section className={styles.aiShowcase}>
          <h2>Coming Soon: AI-Powered Assistance</h2>
          <p>Ask our AI anything about your chores and purchases!</p>
          <div className={styles.aiChatbox}>
            <FaRobot className={styles.aiIcon} />
            <div className={styles.staticTextBox}>
              <TypingEffect
                texts={[
                  "What is the replacement filter for my fridge?",
                  "When did I last change my car's oil?",
                  "What's the warranty status of my laptop?",
                  "When is my next house cleaning due?"
                ]}
                typingSpeed={700}
                eraseSpeed={1000}
              />
            </div>
          </div>
          <p className={styles.aiDisclaimer}>AI feature is under development and will be available soon.</p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2023 LifeTrackr. All rights reserved. | We will never sell your data.</p>
        <p className={styles.madeBy}>Made with ❤️ by SKP</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className={styles.feature}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {icon}
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}
