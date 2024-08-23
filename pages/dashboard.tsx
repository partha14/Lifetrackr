import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import styles from '../styles/Dashboard.module.css'
import { FaTachometerAlt, FaClipboardList, FaShoppingCart, FaCalendarAlt, FaDollarSign, FaSync } from 'react-icons/fa'
import LoadingSpinner from '../components/LoadingSpinner'
import { supabase } from '../utils/supabaseClient'
import { handleError } from '../utils/errorHandler'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

interface Purchase {
  id: number;
  name: string;
  price: number;
  date: string;
  notes?: string;
  warranty_end_date?: string | null;
}

interface Chore {
  id: number;
  name: string;
  dueDate: string;
}

export default function Dashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>('')
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [chores, setChores] = useState<Chore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNameLoading, setIsNameLoading] = useState(true)
  const [user_id, setUserId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setIsNameLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const fullName = user.user_metadata?.full_name
        setUserName(fullName || user.email || 'User')
        setUserId(user.id)
        const recentPurchases = await fetchRecentPurchases(user.id)
        const upcomingChores = await fetchUpcomingChores(user.id)
        setPurchases(recentPurchases)
        setChores(upcomingChores)
      } else {
        router.push('/login')
      }
    } catch (error) {
      handleError(error, 'Failed to fetch dashboard data')
      toast.error('Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
      setIsNameLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Layout>
      <div className={styles.pageContent}>
        <div className={`${styles.headerContainer} flex flex-wrap items-center justify-between gap-4`}>
          <h1 className={`${styles.title} flex flex-wrap items-center gap-2`}>
            <FaTachometerAlt /> 
            <span className="break-all">
              Welcome, {isNameLoading ? <LoadingSpinner size="small" /> : userName}!
            </span>
          </h1>
          <div className={`${styles.buttonGroup} flex flex-wrap gap-2`}>
            <button onClick={fetchData} className={`${styles.button} ${styles.refreshButton}`}>
              <FaSync /> Refresh
            </button>
            <button onClick={() => router.push('/feedback')} className={`${styles.button} ${styles.feedbackButton}`}>
              Provide Feedback
            </button>
          </div>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h2><FaClipboardList /> Recent Chores</h2>
              {chores.length > 0 ? (
                <ul className={styles.list}>
                  {chores.map((chore) => (
                    <li key={chore.id} className={styles.listItem}>
                      <span>{chore.name}</span>
                      <span className={styles.choreDate}>
                        <FaCalendarAlt className={styles.icon} /> {new Date(chore.dueDate).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming chores.</p>
              )}
              <button onClick={() => router.push('/chores')} className={styles.button}>View All Chores</button>
            </div>
            <div className={styles.card}>
              <h2><FaShoppingCart /> Recent Purchases</h2>
              {purchases.length > 0 ? (
                <ul className={styles.list}>
                  {purchases.map((purchase) => (
                    <li key={purchase.id} className={styles.listItem}>
                      <span className={styles.purchaseName}>{purchase.name}</span>
                      <span className={styles.purchasePrice}>
                        <FaDollarSign className={styles.icon} /> {purchase.price.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent purchases.</p>
              )}
              <button onClick={() => router.push('/purchases')} className={styles.button}>View All Purchases</button>
            </div>
            <div className={styles.card}>
              <h2><FaDollarSign /> Total Spending</h2>
              <p className={styles.totalSpending}>
                ${purchases.reduce((total, purchase) => total + purchase.price, 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.calendarSection}>
        <h2 className={styles.sectionTitle}>Chore Calendar</h2>
        <Calendar
          localizer={momentLocalizer(moment)}
          events={chores.map(chore => ({
            title: chore.name,
            start: new Date(chore.dueDate),
            end: new Date(chore.dueDate),
            allDay: true,
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={['month', 'week', 'day']}
          defaultView="month"
          toolbar={true}
          className={styles.reactBigCalendar}
          eventPropGetter={(event) => ({
            className: styles.calendarEvent,
            style: {
              backgroundColor: event.title.toLowerCase().includes('clean') ? '#4CAF50' :
                               event.title.toLowerCase().includes('car') ? '#2196F3' :
                               event.title.toLowerCase().includes('garden') ? '#FF9800' :
                               event.title.toLowerCase().includes('home') ? '#9C27B0' : '#E91E63',
            },
          })}
        />
      </div>
    </Layout>
  )
}

async function fetchRecentPurchases(user_id: string) {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', user_id)
      .order('date', { ascending: false })
      .limit(5)
    
    if (error) {
      console.error('Error fetching recent purchases:', error)
      throw error
    }
    return data || []
  } catch (error) {
    handleError(error, 'Error fetching recent purchases')
    return []
  }
}

async function fetchUpcomingChores(user_id: string) {
  try {
    const { data, error } = await supabase
      .from('chores')
      .select('*')
      .eq('user_id', user_id)
      .order('dueDate', { ascending: true })
      .limit(5)
    
    if (error) throw error
    return data || []
  } catch (error) {
    handleError(error, 'Error fetching upcoming chores')
    return []
  }
}
