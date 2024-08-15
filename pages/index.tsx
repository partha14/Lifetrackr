import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { FaShoppingCart, FaClipboardList, FaBrain, FaRobot } from 'react-icons/fa';
import TypingEffect from '../components/TypingEffect';

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
          <p>
            Effortlessly organize your life, from chores to purchases. LifeTrackr remembers so you don't have to. 
            Experience the freedom of a well-managed life with our innovative app, now in beta!
          </p>
          <Link href="/signup" className={styles.ctaButton}>Join the Beta</Link>
        </section>

        <section className={styles.features}>
          <div className={styles.feature}>
            <FaShoppingCart className={styles.featureIcon} />
            <h3>Track Purchases</h3>
            <p>Never forget warranty periods or when you bought something.</p>
          </div>
          <div className={styles.feature}>
            <FaClipboardList className={styles.featureIcon} />
            <h3>Manage Chores</h3>
            <p>Keep track of important home and vehicle maintenance tasks.</p>
          </div>
          <div className={styles.feature}>
            <FaBrain className={styles.featureIcon} />
            <h3>Peace of Mind</h3>
            <p>Free up mental space and never worry about forgetting important tasks.</p>
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
