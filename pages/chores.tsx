import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../utils/supabaseClient'
import LoadingSpinner from '../components/LoadingSpinner'
import Layout from '../components/Layout'
import { FaPlus, FaSync, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClipboardList, FaRecycle, FaStickyNote, FaTrash, FaSearch, FaChevronDown, FaChevronUp, FaTimes, FaEdit, FaSave } from 'react-icons/fa'
import TypingEffect from '../components/TypingEffect'
import { handleError } from '../utils/errorHandler'
import toast, { Toaster } from 'react-hot-toast'
import styles from '../styles/Dashboard.module.css'
import { useRouter } from 'next/router'
import ErrorBoundary from '../components/ErrorBoundary'

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

interface EditChoreFormProps {
  chore: Chore;
  onSave: (editedChore: Chore) => void;
  onCancel: () => void;
}

function EditChoreForm({ chore, onSave, onCancel }: EditChoreFormProps) {
  const [editedChore, setEditedChore] = useState<Chore>(chore);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedChore(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedChore);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Chore Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={editedChore.name}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="dueDate" className={styles.label}>Due Date</label>
        <input
          id="dueDate"
          type="date"
          name="dueDate"
          value={editedChore.dueDate.split('T')[0]}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <div className={styles.checkboxGroup}>
          <input
            id="isRecurring"
            type="checkbox"
            name="isRecurring"
            checked={editedChore.isRecurring}
            onChange={(e) => setEditedChore(prev => ({ ...prev, isRecurring: e.target.checked }))}
            className={styles.checkbox}
          />
          <label htmlFor="isRecurring" className={styles.checkboxLabel}>Recurring</label>
        </div>
      </div>
      {editedChore.isRecurring && (
        <div className={styles.formGroup}>
          <label htmlFor="recurringPeriod" className={styles.label}>Recurrence</label>
          <select
            id="recurringPeriod"
            name="recurringPeriod"
            value={editedChore.recurringPeriod}
            onChange={handleChange}
            className={styles.select}
          >
            <option key="daily" value="daily">Daily</option>
            <option key="weekly" value="weekly">Weekly</option>
            <option key="monthly" value="monthly">Monthly</option>
            <option key="yearly" value="yearly">Yearly</option>
          </select>
        </div>
      )}
      <div className={styles.formGroup}>
        <label htmlFor="notes" className={styles.label}>Notes (optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={editedChore.notes || ''}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Add any additional details"
        />
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={`${styles.button} ${styles.saveButton}`}>
          <FaSave className={styles.buttonIcon} /> Save
        </button>
        <button type="button" onClick={onCancel} className={`${styles.button} ${styles.cancelButton}`}>
          <FaTimes className={styles.buttonIcon} /> Cancel
        </button>
      </div>
    </form>
  );
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
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingChore, setEditingChore] = useState<Chore | null>(null)

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
      console.error('Failed to get user information. Please try again.')
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
      
      console.log('Fetched chores:', data)
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

  const addChore = useCallback(async () => {
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
        toast.success('Chore added successfully!')
      } catch (error) {
        console.error('Failed to add chore:', error)
        if (error instanceof Error) {
          toast.error(`Failed to add chore: ${error.message}`)
        } else {
          toast.error('Failed to add chore. Please try again.')
        }
      }
    } else {
      toast.error('Please fill in all required fields.')
    }
  }, [choreName, selectedCategory, user_id, dueDate, recurrence, notes, fetchChores])

  const resetForm = () => {
    setChoreName('')
    setDueDate(new Date())
    setRecurrence('none')
    setNotes('')
    setSearchTerm('')
  }

  const handleEditChore = useCallback((chore: Chore) => {
    setEditingChore(chore)
  }, [])

  const handleSaveEdit = async (editedChore: Chore) => {
    try {
      console.log('Attempting to save edited chore:', editedChore);

      if (!editedChore) {
        throw new Error('Invalid chore data');
      }

      const choreId = editedChore.id;
      if (!choreId) {
        throw new Error('Chore ID is missing');
      }

      if (!user_id) {
        throw new Error('User ID is missing');
      }

      const { error } = await supabase
        .from('chores')
        .update({
          name: editedChore.name,
          dueDate: new Date(editedChore.dueDate).toISOString(),
          isRecurring: editedChore.isRecurring,
          recurringPeriod: editedChore.isRecurring ? editedChore.recurringPeriod : null,
          notes: editedChore.notes,
          user_id: user_id, // Include the user_id in the update
        })
        .eq('id', choreId)

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Chore updated successfully');
      // Ensure the updated chore is reflected in the state
      setChores(prevChores => prevChores.map(chore => 
        chore.id === choreId ? { ...chore, ...editedChore, user_id } : chore // Merge changes and include user_id
      ));
      setEditingChore(null);
      toast.success('Chore updated successfully!');

    } catch (error) {
      console.error('Error in handleSaveEdit:', error);
      handleError(error, 'Failed to update chore');
      toast.error('Failed to update chore. Please try again.');
    }
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
        toast.success('Chore deleted successfully!')
      } catch (error) {
        handleError(error, 'Failed to delete chore')
      }
    }
  }

  const filteredTemplates = useMemo(() => {
    return choreCategories
      .find(c => c.name === selectedCategory)
      ?.templates.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())) || []
  }, [selectedCategory, searchTerm])

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
        <Toaster position="top-right" />
        <div className={styles.pageContent}>
          <div className={styles.headerContainer}>
            <h1 className={styles.title}><FaClipboardList /> My Chores</h1>
            <button onClick={fetchChores} className={`${styles.button} ${styles.refreshButton}`}>
              <FaSync /> Refresh
            </button>
          </div>
          
          <div className={`${styles.addChoreSection} ${styles.card}`}>
            <div className={styles.addChoreSectionHeader}>
              <h2 className={styles.sectionTitle}>Add New Chore</h2>
              <button 
                className={styles.toggleFormButton}
                onClick={() => setIsFormVisible(!isFormVisible)}
              >
                {isFormVisible ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            {isFormVisible && (
              <div>
                <div className={styles.formFlexContainer}>
                  <div className={styles.formColumn}>
                    <div className={`${styles.categorySelector} ${styles.mobileOnly}`}>
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
                    <div className={`${styles.categoryTabs} ${styles.desktopOnly}`}>
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
            )}
          </div>
          
          {isLoading ? (
            <LoadingSpinner size="medium" text="Loading chores..." />
          ) : (
            <>
              {chores.length > 0 ? (
                <div className={styles.choreGrid}>
                  {chores.map((chore) => (
                    <div key={chore.id} className={styles.choreCard}>
                      <input type="hidden" value={chore.id} />
                      {editingChore && editingChore.id === chore.id ? (
                        <EditChoreForm
                          chore={editingChore}
                          onSave={handleSaveEdit}
                          onCancel={() => setEditingChore(null)}
                        />
                      ) : (
                        <>
                          <div className={styles.choreHeader}>
                            <h3 className={styles.choreTitle}>{chore.name}</h3>
                            <div className={styles.choreActions}>
                              <button 
                                onClick={() => handleEditChore(chore)} 
                                className={styles.editButton}
                                aria-label="Edit chore"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleDeleteChore(chore.id)} 
                                className={styles.deleteButton}
                                aria-label="Delete chore"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          <div className={styles.choreInfo}>
                            <div className={styles.choreInfoItem}>
                              <FaCalendarAlt className={styles.icon} />
                              <span>{new Date(chore.dueDate).toISOString().split('T')[0]}</span>
                            </div>
                            {chore.isRecurring && (
                              <div className={styles.choreInfoItem}>
                                <FaRecycle className={styles.icon} />
                                <span>{chore.recurringPeriod}</span>
                              </div>
                            )}
                            {chore.notes && (
                              <div className={styles.choreInfoItem}>
                                <FaStickyNote className={styles.icon} />
                                <span>{chore.notes}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
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
