import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { handleError } from '../utils/errorHandler'
import { FaHome, FaCar, FaUtensils, FaTshirt, FaTools, FaCalendarAlt, FaPlus } from 'react-icons/fa'
import { ErrorMessage } from './ErrorMessage'
import { FormErrorMessage } from './FormErrorMessage'
import TypingEffect from './TypingEffect'

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
    dueDate: new Date().toISOString().split('T')[0], // Set default to current date
    isRecurring: false,
    recurringPeriod: '',
    notes: '',
    user_id,
    category: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleTemplateSelect = (template: string) => {
    const selectedTemplate = choreTemplates.find(t => t.name === template);
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        name: selectedTemplate.name,
        category: selectedTemplate.category,
      }))
    }
  }

  const choreCategories = [
    { name: "Home", icon: FaHome },
    { name: "Car", icon: FaCar },
    { name: "Food", icon: FaUtensils },
    { name: "Clothing", icon: FaTshirt },
    { name: "Maintenance", icon: FaTools },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Chore name is required'
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required'
    if (!formData.category) newErrors.category = 'Category is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
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
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">Add New Chore</h2>
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 md:space-y-10">
        {error && <ErrorMessage message={error} />}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <FormErrorMessage name="category" errors={errors} />
          <FormErrorMessage name="name" errors={errors} />
          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="category" className="text-base sm:text-lg md:text-xl font-semibold">Category</label>
            <select 
              id="category"
              value={formData.category} 
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full p-3 border rounded text-base sm:text-lg"
              aria-label="Select chore category"
            >
              <option value="">Select a category</option>
              {choreCategories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="name" className="text-base sm:text-lg md:text-xl font-semibold">Chore Name</label>
            <select
              id="choreTemplate"
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full p-3 border rounded mb-3 text-base sm:text-lg"
              aria-label="Select chore template"
            >
              <option value="">Select a chore template or enter custom name</option>
              {choreTemplates
                .filter((template) => !formData.category || template.category === formData.category)
                .map((template) => (
                  <option key={template.name} value={template.name}>
                    {template.name}
                  </option>
                ))}
            </select>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Or enter custom chore name"
                required
                className="w-full p-3 border rounded text-base sm:text-lg"
                aria-label="Enter custom chore name"
                aria-required="true"
              />
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <TypingEffect
                  texts={[
                    "Clean gutters",
                    "Mow the lawn",
                    "Wash the car",
                    "Vacuum the living room",
                    "Do the laundry"
                  ]}
                  onTextChange={(text) => handleChange('name', text)}
                  className="w-full h-full p-3 text-gray-400 text-base sm:text-lg"
                  typingSpeed={100}
                  eraseSpeed={30}
                  eraseDelay={2000}
                  typeDelay={1000}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <label htmlFor="dueDate" className="text-base sm:text-lg md:text-xl font-semibold">Due Date</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full pl-12 p-3 border rounded text-base sm:text-lg"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-gray-100 p-4 sm:p-5 rounded-md">
          <input
            type="checkbox"
            id="isRecurring"
            checked={formData.isRecurring}
            onChange={(e) => handleChange('isRecurring', e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="isRecurring" className="text-base sm:text-lg md:text-xl font-semibold">Recurring Chore</label>
        </div>

        {formData.isRecurring && (
          <div className="space-y-2 sm:space-y-3 bg-blue-50 p-4 sm:p-5 rounded-md">
            <label htmlFor="recurringPeriod" className="text-base sm:text-lg md:text-xl font-semibold">Recurring Period</label>
            <select
              id="recurringPeriod"
              value={formData.recurringPeriod}
              onChange={(e) => handleChange('recurringPeriod', e.target.value)}
              className="w-full p-3 border rounded text-base sm:text-lg"
            >
              <option value="">Select Recurring Period</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}

        <div className="space-y-2 sm:space-y-3">
          <label htmlFor="notes" className="text-base sm:text-lg md:text-xl font-semibold">Notes (optional)</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Add any additional notes"
            className="w-full p-3 border rounded h-24 sm:h-32 text-base sm:text-lg"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-semibold bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center transition duration-300" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : (
            <>
              <FaPlus className="mr-3 text-xl" /> Add Chore
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddChoreForm;
