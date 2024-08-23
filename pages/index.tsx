import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { FaShoppingCart, FaClipboardList, FaBrain, FaRobot } from 'react-icons/fa';
import TypingEffect from '../components/TypingEffect';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

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
          <h1>LifeTrackr: Your All-in-One Home and Life Assistant</h1>
          <h2>Household Management made seamless</h2>
          <p>Manage purchases, track warranties, and schedule chores effortlessly. Experience smarter home and life organization today!</p>
          <Link href="/signup" className={styles.ctaButton}>Sign up for free</Link>
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

        <section className={styles.screenshots}>
          <h2>See LifeTrackr in Action</h2>
          <div className={styles.screenshotGrid}>
            <div className={styles.screenshotItem}>
              <Image src="/UI-screenshot.png" alt="LifeTrackr UI" width={400} height={300} />
              <p>Intuitive User Interface</p>
            </div>
            <div className={styles.screenshotItem}>
              <Image src="/Calendarview.png" alt="Calendar View" width={400} height={300} />
              <p>Organized Calendar View</p>
            </div>
            <div className={styles.screenshotItem}>
              <Image src="/ListOfChores.png" alt="List of Chores" width={400} height={300} />
              <p>Comprehensive Chore List</p>
            </div>
          </div>
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
            {faqItems.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        <section className={styles.testimonials}>
          <h2>What Our Users Say</h2>
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonial}>
              <p>"Yet another To-do app with the AI tag! /s"</p>
              <p className={styles.testimonialAuthor}>- Sarah K., random person on Twitter</p>
            </div>
            <div className={styles.testimonial}>
              <p>"My 8 y.o. can code up this app in 5hrs using AI"</p>
              <p className={styles.testimonialAuthor}>- Mike R., Tech Enthusiast</p>
            </div>
            <div className={styles.testimonial}>
              <p>"Best app. So proud of you!"</p>
              <p className={styles.testimonialAuthor}>- The Developer's mom</p>
            </div>
          </div>
        </section>


        <section className={styles.whyChoose}>
          <h2>Why Choose LifeTrackr?</h2>
          <div className={styles.reasonsGrid}>
            <div className={styles.reason}>
              <h3>All-in-One Solution</h3>
              <p>Manage your entire household from a single app.</p>
            </div>
            <div className={styles.reason}>
              <h3>AI-Powered Insights</h3>
              <p>Get smart recommendations to optimize your home management.</p>
            </div>
            <div className={styles.reason}>
              <h3>Money-Saving Features</h3>
              <p>Track warranties and expenses to reduce unnecessary costs.</p>
            </div>
            <div className={styles.reason}>
              <h3>Time-Saving Automation</h3>
              <p>Automate recurring tasks and never forget a chore again.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Experience the Future of Home and Life Management</h2>
          <p>Join LifeTrackr Beta today and transform the way you organize your household and life!</p>
          <Link href="/signup" className={styles.ctaButton}>Start For Free</Link>
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
const faqItems = [
  {
    question: "How is LifeTrackr different from other home management apps?",
    answer: "LifeTrackr goes beyond home management, offering a comprehensive life organization solution. Our AI-powered natural language Q&A about your data aims to provide accurate answers without any hallucinations."
  },
  {
    question: "Can I use LifeTrackr for both personal and work tasks?",
    answer: "Yes! LifeTrackr is designed to manage all aspects of your life, including personal, work, and everything in between."
  },
  // Add more FAQ items here
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.faqItem}>
      <h3 onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        {question} {isOpen ? '▲' : '▼'}
      </h3>
      <AnimatePresence>
        {isOpen && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
