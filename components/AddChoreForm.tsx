import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import styles from '../styles/Dashboard.module.css'
import formStyles from '../styles/Form.module.css'
import { handleError } from '../utils/errorHandler'
import { FaPlus, FaCalendarAlt, FaRecycle, FaStickyNote, FaClock, FaExclamationCircle, FaHome, FaCar, FaUtensils, FaTshirt, FaTools } from 'react-icons/fa'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

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
    <form onSubmit={handleSubmit} className={`${styles.addChoreForm} ${formStyles.responsiveForm}`}>
      <h2 className={formStyles.formTitle}>Add New Chore</h2>
      {error && (
        <div className={formStyles.errorMessage}>
          <FaExclamationCircle className={formStyles.errorIcon} />
          {error}
        </div>
      )}
      <div className={formStyles.formGrid}>
        <div className={formStyles.formGroup}>
          <label htmlFor="name" className={formStyles.label}>
            <FaPlus className={formStyles.icon} /> Chore Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter chore name"
            required
            className={formStyles.input}
          />
        </div>
        <div className={formStyles.formGroup}>
          <label htmlFor="category" className={formStyles.label}>
            <FaPlus className={formStyles.icon} /> Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={formStyles.select}
          >
            <option value="">Select Category</option>
            <option value="Home">Home</option>
            <option value="Car">Car</option>
            <option value="Food">Food</option>
            <option value="Clothing">Clothing</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>
      <div className={formStyles.formGroup}>
        <label htmlFor="templateSelect" className={formStyles.label}>
          <FaPlus className={formStyles.icon} /> Chore Templates
        </label>
        <select
          id="templateSelect"
          className={formStyles.select}
          onChange={(e) => {
            const selectedTemplate = choreTemplates.find(t => t.name === e.target.value);
            if (selectedTemplate) handleTemplateSelect(selectedTemplate);
          }}
        >
          <option value="">Select a template</option>
          {choreTemplates.map((template, index) => (
            <option key={index} value={template.name}>
              {template.name} ({template.category})
            </option>
          ))}
        </select>
      </div>
      <div className={formStyles.formGrid}>
        <div className={formStyles.formGroup}>
          <label htmlFor="dueDate" className={formStyles.label}>
            <FaCalendarAlt className={formStyles.icon} /> Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className={formStyles.input}
          />
        </div>
        <div className={formStyles.formGroup}>
          <div className={formStyles.checkboxGroup}>
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              id="isRecurring"
              className={formStyles.checkbox}
            />
            <label htmlFor="isRecurring" className={formStyles.checkboxLabel}>
              <FaRecycle className={formStyles.icon} /> Recurring Chore
            </label>
          </div>
          {formData.isRecurring && (
            <select
              id="recurringPeriod"
              name="recurringPeriod"
              value={formData.recurringPeriod}
              onChange={handleChange}
              className={formStyles.select}
            >
              <option value="">Select Recurring Period</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          )}
        </div>
      </div>
            <div>
              <Label htmlFor="notes" className="text-sm">Notes (optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes"
                className="mt-1"
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Add Chore
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddChoreForm;
