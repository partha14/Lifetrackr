import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { handleError } from '../utils/errorHandler'
import { FaExclamationCircle, FaHome, FaCar, FaUtensils, FaTshirt, FaTools, FaCalendarAlt } from 'react-icons/fa'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add New Chore</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <FaExclamationCircle className="inline mr-2" />
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {choreCategories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    <div className="flex items-center">
                      {React.createElement(category.icon, { className: "mr-2 h-4 w-4" })}
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Chore Name</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {formData.name || "Select a chore template or enter custom name"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search chore templates..." />
                  <CommandEmpty>No chore template found.</CommandEmpty>
                  <CommandGroup>
                    {choreTemplates
                      .filter((template) => !formData.category || template.category === formData.category)
                      .map((template) => (
                        <CommandItem
                          key={template.name}
                          onSelect={() => handleTemplateSelect(template.name)}
                        >
                          {React.createElement(template.icon, { className: "mr-2 h-4 w-4" })}
                          {template.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Or enter custom chore name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isRecurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => handleChange('isRecurring', checked)}
            />
            <Label htmlFor="isRecurring">Recurring Chore</Label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="recurringPeriod">Recurring Period</Label>
              <Select
                value={formData.recurringPeriod}
                onValueChange={(value) => handleChange('recurringPeriod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Recurring Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add any additional notes"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
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
