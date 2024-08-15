import React, { useState, useEffect, useCallback, ErrorInfo } from 'react'
import { supabase } from '../utils/supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import Layout from '../components/Layout'
import styles from '../styles/Dashboard.module.css'
import { useRouter } from 'next/router'
import { FaPlus, FaSync, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClipboardList, FaRecycle, FaStickyNote, FaTrash, FaSearch } from 'react-icons/fa'
import { handleError } from '../utils/errorHandler'

const choreCategories = [
  { name: 'Home', color: 'home', icon: '🏠', templates: ['Replace air filters', 'Clean gutters', 'Check smoke detectors', 'Seal windows', 'Service HVAC'] },
  { name: 'Clean', color: 'clean', icon: '🧹', templates: ['Vacuum living room', 'Mop kitchen floor', 'Clean bathroom', 'Dust furniture', 'Wash windows'] },
  { name: 'Car', color: 'car', icon: '🚗', templates: ['Rotate tires', 'Schedule oil change', 'Check tire pressure', 'Wash car', 'Replace wipers'] },
  { name: 'Garden', color: 'garden', icon: '🌻', templates: ['Mow lawn', 'Prune roses', 'Water plants', 'Fertilize garden', 'Plant flowers'] },
  { name: 'Appts', color: 'appts', icon: '📅', templates: ['Dentist appointment', 'Annual check-up', 'Call pest control', 'Car inspection', 'Home maintenance'] },
];

const recurrenceOptions = [
  { value: 'none', label: 'No recurrence' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
];

interface Chore {
  id: number;
  name: string;
  category: string;
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
  const [isLoading, setIsLoading] = useState(true)
  const [user_id, setUserId] = useState<string | null>(null)
  const router = useRouter()

  const [selectedCategory, setSelectedCategory] = useState(choreCategories[0].name)
  const [choreName, setChoreName] = useState('')
  const [dueDate, setDueDate] = useState(new Date())
  const [recurrence, setRecurrence] = useState('none')
  const [notes, setNotes] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

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

  const addChore = async () => {
    if (choreName && selectedCategory && user_id) {
      try {
        const { data, error } = await supabase
          .from('chores')
          .insert([
            {
              name: choreName,
              category: selectedCategory,
              dueDate: dueDate.toISOString(),
              isRecurring: recurrence !== 'none',
              recurringPeriod: recurrence !== 'none' ? recurrence : null,
              notes,
              user_id
            }
          ])
        
        if (error) throw error
        
        fetchChores()
        resetForm()
      } catch (error) {
        handleError(error, 'Failed to add chore')
      }
    }
  }

  const resetForm = () => {
    setChoreName('')
    setDueDate(new Date())
    setRecurrence('none')
    setNotes('')
    setSearchTerm('')
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

  const filteredTemplates = choreCategories
    .find(c => c.name === selectedCategory)
    ?.templates.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())) || []

  if (!user_id) {
    return <LoadingSpinner>Loading user data...</LoadingSpinner>
  }

  return (
    <ErrorBoundary>
      <Layout>
        <div className={styles.pageContent}>
          <div className={styles.headerContainer}>
            <h1 className={styles.title}><FaClipboardList /> My Chores</h1>
            <button onClick={fetchChores} className={`${styles.button} ${styles.refreshButton}`}>
              <FaSync /> Refresh
            </button>
          </div>
          
          <div className={`${styles.addChoreSection} ${styles.card}`}>
            <h2 className={styles.sectionTitle}>Add New Chore</h2>
            <div className={styles.categoryTabs}>
              {choreCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`${styles.categoryTab} ${selectedCategory === category.name ? styles.activeTab : ''}`}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <span className={styles.categoryName}>{category.name}</span>
                </button>
              ))}
            </div>
            
            <div className={styles.searchContainer}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search or type custom"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.templateList}>
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setChoreName(template)}
                    className={styles.templateButton}
                  >
                    {template}
                  </button>
                ))
              ) : (
                <p className={styles.noTemplates}>No matches. Type to create custom.</p>
              )}
            </div>
            
            <input
              type="text"
              value={choreName}
              onChange={(e) => setChoreName(e.target.value)}
              placeholder="Enter chore name"
              className={styles.choreNameInput}
            />
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Due Date</label>
              <input
                type="date"
                value={dueDate.toISOString().split('T')[0]}
                onChange={(e) => setDueDate(new Date(e.target.value))}
                className={styles.dateInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={recurrence !== 'none'}
                  onChange={(e) => setRecurrence(e.target.checked ? 'weekly' : 'none')}
                  className={styles.checkbox}
                />
                Recurring
              </label>
            </div>
            
            {recurrence !== 'none' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Recurrence Period</label>
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value)}
                  className={styles.selectInput}
                >
                  {recurrenceOptions.filter(option => option.value !== 'none').map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={styles.textArea}
                placeholder="Add any additional details"
              />
            </div>
            
            <button onClick={addChore} className={`${styles.button} ${styles.addButton}`}>
              <FaPlus /> Add Chore
            </button>
          </div>
          
          {isLoading ? (
            <LoadingSpinner>Loading chores...</LoadingSpinner>
          ) : (
            <>
              {chores.length > 0 ? (
                <div className={styles.cardGrid}>
                  {chores.map((chore) => (
                    <div key={chore.id} className={`${styles.card} ${styles[chore.category.toLowerCase()]}`}>
                      <h3 className={styles.choreTitle}>{chore.name}</h3>
                      <p className={styles.choreCategory}>
                        {choreCategories.find(c => c.name === chore.category)?.icon} {chore.category}
                      </p>
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
                  <p>Use the form above to add your first chore!</p>
                </div>
              )}
            </>
          )}
        </div>
      </Layout>
    </ErrorBoundary>
  )
}
