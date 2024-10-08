import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { handleError } from '../utils/errorHandler'
import { FaHome, FaCar, FaUtensils, FaTshirt, FaTools, FaCalendarAlt, FaPlus } from 'react-icons/fa'
import { IconType } from 'react-icons'
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
  ];

  const CategoryIcon: React.FC<{ category: string; icon: IconType; onClick: () => void; isSelected: boolean }> = ({ category, icon: Icon, onClick, isSelected }) => (
    <div 
      className={`flex flex-col items-center justify-center p-1 sm:p-2 border rounded cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'} w-full`}
      onClick={onClick}
    >
      <Icon className={`text-base sm:text-lg mb-1 ${isSelected ? 'text-blue-500' : ''}`} />
      <span className={`text-xs sm:text-sm text-center ${isSelected ? 'font-semibold' : ''}`}>{category}</span>
    </div>
  );

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
    <div className="container mx-auto px-2 py-3 sm:px-4 sm:py-6">
      <div className="w-full max-w-md mx-auto p-2 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-2 sm:mb-4">Add New Chore</h2>
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">
          {error && <ErrorMessage message={error} />}
          
          <div className="space-y-3 sm:space-y-6">
            <FormErrorMessage name="category" errors={errors} />
            <FormErrorMessage name="name" errors={errors} />
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm sm:text-base font-semibold">Category</label>
              <div className="mb-2 sm:mb-3">
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2 sm:justify-center">
                  {choreCategories.map((category) => (
                    <CategoryIcon
                      key={category.name}
                      category={category.name}
                      icon={category.icon}
                      onClick={() => handleChange('category', category.name)}
                      isSelected={formData.category === category.name}
                    />
                  ))}
                </div>
              </div>
              {formData.category && (
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  Selected category: <span className="font-semibold">{formData.category}</span>
                </p>
              )}
            </div>

            <div className="space-y-2 sm:space-y-4">
              <label htmlFor="name" className="text-sm sm:text-base font-semibold">Chore Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter chore name"
                required
                className="w-full p-2 border rounded text-sm sm:text-base"
                aria-label="Enter chore name"
                aria-required="true"
              />
              <select
                id="choreTemplate"
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full p-2 border rounded text-sm sm:text-base"
                aria-label="Select chore template"
              >
                <option value="">Or select a chore template</option>
                {choreTemplates
                  .filter((template) => !formData.category || template.category === formData.category)
                  .map((template) => (
                    <option key={template.name} value={template.name}>
                      {template.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

        <div className="space-y-2">
          <label htmlFor="dueDate" className="text-sm sm:text-base font-semibold">Due Date</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full pl-8 p-2 border rounded text-sm sm:text-base"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-gray-100 p-2 sm:p-3 rounded-md">
          <input
            type="checkbox"
            id="isRecurring"
            checked={formData.isRecurring}
            onChange={(e) => handleChange('isRecurring', e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="isRecurring" className="text-sm sm:text-base font-semibold">Recurring Chore</label>
        </div>

        {formData.isRecurring && (
          <div className="space-y-2 bg-blue-50 p-2 sm:p-3 rounded-md">
            <label htmlFor="recurringPeriod" className="text-sm sm:text-base font-semibold">Recurring Period</label>
            <select
              id="recurringPeriod"
              value={formData.recurringPeriod}
              onChange={(e) => handleChange('recurringPeriod', e.target.value)}
              className="w-full p-2 border rounded text-sm sm:text-base"
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

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm sm:text-base font-semibold">Notes (optional)</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Add any additional notes"
            className="w-full p-2 border rounded h-20 text-sm sm:text-base"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2 text-sm sm:text-base font-semibold bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center transition duration-300" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : (
            <>
              <FaPlus className="mr-2 text-base" /> Add Chore
            </>
          )}
        </button>
      </form>
    </div>
  </div>
  );
};

export default AddChoreForm;
