import React, { useState, useEffect, useCallback, ErrorInfo } from 'react'
import { supabase } from '../utils/supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import Layout from '../components/Layout'
import styles from '../styles/Dashboard.module.css'
import { useRouter } from 'next/router'
import { FaPlus, FaSync, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClipboardList, FaRecycle, FaStickyNote, FaTrash, FaSearch, FaChevronDown } from 'react-icons/fa'
import TypingEffect from '../components/TypingEffect'
import { handleError } from '../utils/errorHandler'
import { toast } from 'react-toastify'

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
  dueDate: string;
  isRecurring: boolean;
  recurringPeriod?: string;
  notes?: string;
  user_id: string;
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, errorMessage: string}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
    // You could also log this error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <h1 className={styles.errorMessage}>Something went wrong.</h1>
          <p className={styles.errorDetails}>{this.state.errorMessage}</p>
          <button onClick={() => window.location.reload()} className={styles.refreshButton}>
            Refresh Page
          </button>
        </div>
      )
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
      console.error('Error in getUserId:', error)
      handleError(error, 'Failed to get user information')
      toast.error('Failed to get user information. Please try again.')
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
      console.error('Error in fetchChores:', error)
      handleError(error, 'Failed to fetch chores')
      toast.error('Failed to fetch chores. Please try again.')
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
        const newChore = {
          name: choreName,
          dueDate: dueDate.toISOString(),
          isRecurring: recurrence !== 'none',
          recurringPeriod: recurrence !== 'none' ? recurrence : null,
          notes,
          user_id
        }
        console.log('Attempting to add chore:', newChore)

        const { data, error } = await supabase
          .from('chores')
          .insert([newChore])
        
        if (error) {
          console.error('Supabase error:', error)
          throw error
        }
        
        console.log('Chore added successfully:', data)
        await fetchChores()
        resetForm()
      } catch (error) {
        console.error('Failed to add chore:', error)
        if (error instanceof Error) {
          alert(`Failed to add chore: ${error.message}`)
        } else {
          alert('Failed to add chore. Please try again.')
        }
      }
    } else {
      alert('Please fill in all required fields.')
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
    return (
      <Layout>
        <div className={styles.pageContent}>
          <LoadingSpinner size="medium" text="Loading user data..." />
        </div>
      </Layout>
    )
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
            <div className={styles.formFlexContainer}>
              <div className={styles.formColumn}>
                <div className={styles.categorySelector}>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={styles.categoryDropdown}
                  >
                    {choreCategories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                
                <div className={styles.dropdownContainer}>
                  <div className={styles.dropdownHeader}>
                    <span>Select a template or type custom</span>
                    <FaChevronDown className={styles.dropdownIcon} />
                  </div>
                  <div className={styles.dropdownList}>
                    <div className={styles.searchContainer}>
                      <FaSearch className={`${styles.searchIcon} text-2xl left-3`} />
                      <input
                        type="text"
                        placeholder="Search templates"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${styles.searchInput} w-full p-4 pl-12 text-xl border rounded`}
                      />
                    </div>
                    {filteredTemplates.length > 0 ? (
                      filteredTemplates.map((template, index) => (
                        <div
                          key={index}
                          onClick={() => setChoreName(template)}
                          className={styles.dropdownItem}
                        >
                          {template}
                        </div>
                      ))
                    ) : (
                      <p className={styles.noTemplates}>No matches found.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.formColumn}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Chore Name</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      value={choreName}
                      onChange={(e) => setChoreName(e.target.value)}
                      className={styles.input}
                      placeholder=" "
                    />
                    <div className={styles.placeholderText}>
                      {!choreName && (
                        <TypingEffect
                          texts={
                            selectedCategory === 'Home'
                              ? choreCategories.find(c => c.name === 'Home')?.templates.slice(0, 2) || []
                              : ['Enter chore name', 'What needs to be done?']
                          }
                          typingSpeed={150}
                          eraseSpeed={75}
                          eraseDelay={4000}
                          typeDelay={2000}
                          className="bg-transparent"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Due Date</label>
                  <input
                    type="date"
                    value={dueDate.toISOString().split('T')[0]}
                    onChange={(e) => setDueDate(new Date(e.target.value))}
                    className={styles.input}
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
                      className={styles.input}
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
                    className={styles.input}
                    placeholder="Add any additional details"
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <button onClick={addChore} className={`${styles.button} ${styles.addButton}`}>
                <FaPlus /> Add Chore
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <LoadingSpinner size="medium" text="Loading chores..." />
          ) : (
            <>
              {chores.length > 0 ? (
                <ul className={styles.choreList}>
                  {chores.map((chore) => (
                    <li key={chore.id} className={styles.choreItem}>
                      <div className={styles.choreInfo}>
                        <h3 className={styles.choreTitle}>{chore.name}</h3>
                        <p className={styles.choreDate}>
                          <FaCalendarAlt className={styles.icon} /> {new Date(chore.dueDate).toLocaleDateString()}
                        </p>
                        {chore.isRecurring && (
                          <p className={styles.choreRecurring}>
                            <FaRecycle className={styles.icon} /> {chore.recurringPeriod}
                          </p>
                        )}
                      </div>
                      <button onClick={() => handleDeleteChore(chore.id)} className={styles.deleteButton}>
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
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
