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
          <h1>Beyond Home Management: Your All-in-One Life Assistant</h1>
          <h2>LifeTrackr: Simplifying Your Home and Life</h2>
          <p>Manage purchases, track warranties, schedule chores, and much more.</p>
          <p>LifeTrackr: Your digital memory for a smarter, organized life.</p>
          <p>Join our beta and experience the next level of life management!</p>
          <Link href="/signup" className={styles.ctaButton}>Start Your Free Trial</Link>
        </section>

        <section className={styles.comparison}>
          <h2>Why Choose LifeTrackr?</h2>
          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonHeader}>
              <h3>Feature</h3>
              <h3>LifeTrackr</h3>
              <h3>Other Apps</h3>
            </div>
            <div className={styles.comparisonRow}>
              <span>Management Scope</span>
              <span>Comprehensive life management</span>
              <span>Limited to home management</span>
            </div>
            <div className={styles.comparisonRow}>
              <span>Task Scheduling</span>
              <span>Smart chore scheduling</span>
              <span>Basic task tracking</span>
            </div>
            <div className={styles.comparisonRow}>
              <span>Purchase Tracking</span>
              <span>With warranty alerts</span>
              <span>Manual warranty tracking</span>
            </div>
            <div className={styles.comparisonRow}>
              <span>AI Integration</span>
              <span>AI-powered assistance (coming soon)</span>
              <span>No AI integration</span>
            </div>
            <div className={styles.comparisonRow}>
              <span>Customization</span>
              <span>Customizable for any lifestyle</span>
              <span>One-size-fits-all approach</span>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <FeatureCard
            icon={<FaShoppingCart className={styles.featureIcon} />}
            title="Smart Purchase Tracking"
            description="Log purchases, set warranty reminders, and get alerts for optimal replacement times."
          />
          <FeatureCard
            icon={<FaClipboardList className={styles.featureIcon} />}
            title="Intelligent Chore Management"
            description="AI-powered chore scheduling that adapts to your lifestyle and home needs."
          />
          <FeatureCard
            icon={<FaBrain className={styles.featureIcon} />}
            title="Life-Wide Organization"
            description="Manage not just your home, but your entire life - work, personal, and everything in between."
          />
          <FeatureCard
            icon={<FaRobot className={styles.featureIcon} />}
            title="AI Assistant (Coming Soon)"
            description="Get personalized advice and answers about your home, purchases, and tasks."
          />
        </section>

        <section className={styles.howItWorks}>
          <h2>How It Works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <h3>1. Add Your Chores</h3>
              <p>Choose from predefined categories or create custom chores.</p>
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

        <section className={styles.faq}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>How is LifeTrackr different from other home management apps?</h3>
              <p>LifeTrackr goes beyond home management, offering a comprehensive life organization solution. Our AI-powered features and customizable approach make it adaptable to any lifestyle.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Is my data safe with LifeTrackr?</h3>
              <p>Absolutely. We use bank-level encryption to protect your data and never sell your information to third parties.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Can I use LifeTrackr for both personal and work tasks?</h3>
              <p>Yes! LifeTrackr is designed to manage all aspects of your life, including personal, work, and everything in between.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>What devices can I use LifeTrackr on?</h3>
              <p>LifeTrackr is available on iOS, Android, and as a web app, allowing you to access your information from any device.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Experience the Future of Life Management</h2>
          <p>Join LifeTrackr Beta today and transform the way you organize your life!</p>
          <Link href="/signup" className={styles.ctaButton}>Start Your Free Trial</Link>
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
