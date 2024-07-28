import React, { useState, useEffect, useCallback, ErrorInfo } from 'react'
import { supabase } from '../utils/supabaseClient'
import AddChoreForm from '../components/AddChoreForm'
import LoadingSpinner from '../components/LoadingSpinner'
import Layout from '../components/Layout'
import styles from '../styles/Dashboard.module.css'
import { useRouter } from 'next/router'
import { FaPlus, FaSync, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClipboardList, FaRecycle, FaStickyNote, FaTrash } from 'react-icons/fa'
import { handleError } from '../utils/errorHandler'

interface Chore {
  id: number;
  name: string;
  dueDate: string;
  isRecurring: boolean;
  recurringPeriod?: string;
  notes?: string;
  user_id: string;
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1 className={styles.errorMessage}>Something went wrong. Please try refreshing the page.</h1>
    }

    return this.props.children
  }
}

export default function Chores() {
  const [chores, setChores] = useState<Chore[]>([])
  const [showAddChore, setShowAddChore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user_id, setUserId] = useState<string | null>(null)
  const router = useRouter()

  const getUserId = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        router.push('/login')
      }
    } catch (error) {
      handleError(error, 'Failed to get user information')
    }
  }, [router])

  useEffect(() => {
    getUserId()
  }, [getUserId])

  const fetchChores = useCallback(async () => {
    if (!user_id) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('chores')
        .select('*')
        .eq('user_id', user_id)
        .order('dueDate', { ascending: true })

      if (error) throw error
      
      setChores(data || [])
    } catch (error) {
      handleError(error, 'Failed to fetch chores')
    } finally {
      setIsLoading(false)
    }
  }, [user_id])

  useEffect(() => {
    if (user_id) {
      fetchChores()
    }
  }, [user_id, fetchChores])

  const handleAddChore = () => {
    setShowAddChore(!showAddChore)
  }

  const handleChoreAdded = () => {
    fetchChores()
    setShowAddChore(false)
  }

  const handleDeleteChore = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this chore?')) {
      try {
        const { error } = await supabase
          .from('chores')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        
        fetchChores()
      } catch (error) {
        handleError(error, 'Failed to delete chore')
      }
    }
  }

  if (!user_id) {
    return <LoadingSpinner>Loading user data...</LoadingSpinner>
  }

  return (
    <ErrorBoundary>
      <Layout>
        <div className={styles.pageContent}>
          <div className={styles.headerContainer}>
            <h1 className={styles.title}><FaClipboardList /> My Chores</h1>
            <div className={styles.buttonGroup}>
              <button onClick={handleAddChore} className={`${styles.button} ${styles.addButton}`}>
                <FaPlus /> {showAddChore ? 'Hide' : 'Add Chore'}
              </button>
              <button onClick={fetchChores} className={`${styles.button} ${styles.refreshButton}`}>
                <FaSync /> Refresh
              </button>
            </div>
          </div>
          {showAddChore && <AddChoreForm onChoreAdded={handleChoreAdded} user_id={user_id} />}
          {isLoading ? (
            <LoadingSpinner>Loading chores...</LoadingSpinner>
          ) : (
            <>
              {chores.length > 0 ? (
                <div className={styles.cardGrid}>
                  {chores.map((chore) => (
                    <div key={chore.id} className={styles.card}>
                      <h3 className={styles.choreTitle}>{chore.name}</h3>
                      <p className={styles.choreDate}>
                        <FaCalendarAlt className={styles.icon} /> {new Date(chore.dueDate).toLocaleDateString()}
                      </p>
                      <p className={styles.choreRecurring}>
                        <FaRecycle className={styles.icon} /> Recurring: {chore.isRecurring ? (
                          <FaCheckCircle className={styles.iconGreen} />
                        ) : (
                          <FaTimesCircle className={styles.iconRed} />
                        )}
                      </p>
                      {chore.isRecurring && <p className={styles.chorePeriod}><FaCalendarAlt className={styles.icon} /> Period: {chore.recurringPeriod}</p>}
                      {chore.notes && <p className={styles.choreNotes}><FaStickyNote className={styles.icon} /> Notes: {chore.notes}</p>}
                      <button onClick={() => handleDeleteChore(chore.id)} className={styles.deleteButton}>
                        <FaTrash /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noChores}>
                  <FaClipboardList className={styles.noChoresIcon} />
                  <p>You haven't added any chores yet.</p>
                  <p>Click the "Add Chore" button to get started!</p>
                </div>
              )}
            </>
          )}
        </div>
      </Layout>
    </ErrorBoundary>
  )
}
