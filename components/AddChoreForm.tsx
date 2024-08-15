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
  const [activeTab, setActiveTab] = useState("Home")

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

  const choreCategories = [
    { name: "Home", icon: <FaHome className="mr-2" /> },
    { name: "Car", icon: <FaCar className="mr-2" /> },
    { name: "Food", icon: <FaUtensils className="mr-2" /> },
    { name: "Clothing", icon: <FaTshirt className="mr-2" /> },
    { name: "Maintenance", icon: <FaTools className="mr-2" /> },
  ]

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
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Add New Chore</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <FaExclamationCircle className="inline mr-2" />
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="name">Chore Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter chore name"
                required
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                {choreCategories.map((category) => (
                  <TabsTrigger key={category.name} value={category.name} className="flex items-center justify-center">
                    {category.icon}
                    <span className="ml-2">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {choreCategories.map((category) => (
                <TabsContent key={category.name} value={category.name}>
                  <ScrollArea className="h-72 rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {choreTemplates
                        .filter((template) => template.category === category.name)
                        .map((template, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleTemplateSelect(template)}
                          >
                            {React.createElement(template.icon, { className: "mr-2 h-4 w-4" })}
                            {template.name}
                          </Button>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
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
