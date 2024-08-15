import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import styles from '../styles/Dashboard.module.css'
import { handleError } from '../utils/errorHandler'
import { FaPlus, FaCalendarAlt, FaRecycle, FaStickyNote, FaClock, FaExclamationCircle, FaHome, FaCar, FaUtensils, FaTshirt, FaTools } from 'react-icons/fa'

interface ChoreFormData {
  name: string;
  dueDate: string;
  isRecurring: boolean;
  recurringPeriod?: string;
  notes: string;
  user_id: string;
  category: string;
}

interface AddChoreFormProps {
  onChoreAdded: () => void;
  user_id: string;
}

const choreTemplates = [
  { name: 'Vacuum Living Room', category: 'Home', icon: FaHome },
  { name: 'Clean Bathroom', category: 'Home', icon: FaHome },
  { name: 'Mow Lawn', category: 'Home', icon: FaHome },
  { name: 'Oil Change', category: 'Car', icon: FaCar },
  { name: 'Wash Car', category: 'Car', icon: FaCar },
  { name: 'Grocery Shopping', category: 'Food', icon: FaUtensils },
  { name: 'Meal Prep', category: 'Food', icon: FaUtensils },
  { name: 'Laundry', category: 'Clothing', icon: FaTshirt },
  { name: 'Iron Clothes', category: 'Clothing', icon: FaTshirt },
  { name: 'Home Maintenance', category: 'Maintenance', icon: FaTools },
];

const AddChoreForm: React.FC<AddChoreFormProps> = ({ onChoreAdded, user_id }) => {
  const [formData, setFormData] = useState<ChoreFormData>({
    name: '',
    dueDate: '',
    isRecurring: false,
    recurringPeriod: '',
    notes: '',
    user_id,
    category: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    setError(null)
  }

  const handleTemplateSelect = (template: { name: string; category: string }) => {
    setFormData(prev => ({
      ...prev,
      name: template.name,
      category: template.category,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!formData.name || !formData.dueDate) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    try {
      const { name, dueDate, isRecurring, recurringPeriod, notes, user_id, category } = formData
      const choreData = { name, dueDate, isRecurring, recurringPeriod, notes, user_id, category }
      
      if (!user_id) {
        throw new Error('user_id is missing')
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id !== user_id) {
        throw new Error('Unauthorized: user_id does not match authenticated user')
      }

      const { data, error } = await supabase
        .from('chores')
        .insert([choreData])
        .select()
      
      if (error) {
        throw error
      } else {
        setFormData({
          name: '',
          dueDate: '',
          isRecurring: false,
          recurringPeriod: '',
          notes: '',
          user_id: user_id,
          category: '',
        })
        onChoreAdded()
      }
    } catch (error) {
      handleError(error, 'An error occurred while adding the chore. Please try again.')
      setError('Failed to add chore. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.addChoreForm}>
      <h2 className={styles.formTitle}>Add New Chore</h2>
      {error && (
        <div className={styles.errorMessage}>
          <FaExclamationCircle className={styles.errorIcon} />
          {error}
        </div>
      )}
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          <FaPlus className={styles.icon} /> Chore Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter chore name"
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <FaPlus className={styles.icon} /> Chore Templates
        </label>
        <div className={styles.templateContainer}>
          {choreTemplates.map((template, index) => (
            <button
              key={index}
              type="button"
              className={styles.templateButton}
              onClick={() => handleTemplateSelect(template)}
            >
              {React.createElement(template.icon, { className: styles.templateIcon })}
              {template.name}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="category" className={styles.label}>
          <FaPlus className={styles.icon} /> Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Select Category</option>
          <option value="Home">Home</option>
          <option value="Car">Car</option>
          <option value="Food">Food</option>
          <option value="Clothing">Clothing</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="dueDate" className={styles.label}>
          <FaCalendarAlt className={styles.icon} /> Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
            id="isRecurring"
            className={styles.checkbox}
          />
          <label htmlFor="isRecurring" className={styles.checkboxLabel}>
            <FaRecycle className={styles.icon} /> Recurring Chore
          </label>
        </div>
      </div>
      {formData.isRecurring && (
        <div className={styles.formGroup}>
          <label htmlFor="recurringPeriod" className={styles.label}>
            <FaClock className={styles.icon} /> Recurring Period
          </label>
          <select
            id="recurringPeriod"
            name="recurringPeriod"
            value={formData.recurringPeriod}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Select Recurring Period</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      )}
      <div className={styles.formGroup}>
        <label htmlFor="notes" className={styles.label}>
          <FaStickyNote className={styles.icon} /> Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional notes"
          className={styles.textarea}
        />
      </div>
      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : (
          <>
            <FaPlus className={styles.buttonIcon} /> Add Chore
          </>
        )}
      </button>
    </form>
  )
}

export default AddChoreForm
