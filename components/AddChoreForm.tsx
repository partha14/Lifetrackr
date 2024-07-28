import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import styles from '../styles/Form.module.css'
import { handleError } from '../utils/errorHandler'

interface ChoreFormData {
  name: string;
  dueDate: string;
  isRecurring: boolean;
  recurringPeriod?: string;
  notes: string;
  user_id: string;
}

interface AddChoreFormProps {
  onChoreAdded: () => void;
  user_id: string;
}

const AddChoreForm: React.FC<AddChoreFormProps> = ({ onChoreAdded, user_id }) => {
  const [formData, setFormData] = useState<ChoreFormData>({
    name: '',
    dueDate: '',
    isRecurring: false,
    recurringPeriod: '',
    notes: '',
    user_id,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.dueDate) {
      alert('Please fill in all required fields')
      return
    }
    try {
      const { name, dueDate, isRecurring, recurringPeriod, notes, user_id } = formData
      const choreData = { name, dueDate, isRecurring, recurringPeriod, notes, user_id }
      console.log('Attempting to add chore:', choreData)
      // Verify that user_id is present and not undefined
      if (!user_id) {
        throw new Error('user_id is missing')
      }
      // Add additional check to ensure user_id matches the authenticated user
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id !== user_id) {
        throw new Error('Unauthorized: user_id does not match authenticated user')
      }
      const { data, error } = await supabase
        .from('chores')
        .insert([choreData])
        .select()
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      } else {
        console.log('Chore added successfully. Response:', data)
        alert('Chore added successfully!')
        setFormData({
          name: '',
          dueDate: '',
          isRecurring: false,
          recurringPeriod: '',
          notes: '',
          user_id: user_id,
        })
        onChoreAdded()
      }
    } catch (error) {
      handleError(error, 'An error occurred while adding the chore. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Chore Name"
        required
        className={styles.input}
      />
      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <div className={styles.checkboxGroup}>
        <input
          type="checkbox"
          name="isRecurring"
          checked={formData.isRecurring}
          onChange={handleChange}
          id="isRecurring"
        />
        <label htmlFor="isRecurring">Recurring Chore</label>
      </div>
      {formData.isRecurring && (
        <select
          name="recurringPeriod"
          value={formData.recurringPeriod}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="">Select Recurring Period</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      )}
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Notes"
        className={styles.textarea}
      />
      <button type="submit" className={styles.button}>Add Chore</button>
    </form>
  )
}

export default AddChoreForm
