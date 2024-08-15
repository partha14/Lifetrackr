import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { handleError } from '../utils/errorHandler'
import { FaExclamationCircle, FaHome, FaCar, FaUtensils, FaTshirt, FaTools } from 'react-icons/fa'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
    category: 'Home',
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
    { name: "Home", icon: <FaHome className="mr-2 h-4 w-4" /> },
    { name: "Car", icon: <FaCar className="mr-2 h-4 w-4" /> },
    { name: "Food", icon: <FaUtensils className="mr-2 h-4 w-4" /> },
    { name: "Clothing", icon: <FaTshirt className="mr-2 h-4 w-4" /> },
    { name: "Maintenance", icon: <FaTools className="mr-2 h-4 w-4" /> },
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
            <div className="space-y-2">
              <Label htmlFor="name">Chore Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter chore name"
                required
              />
            </div>
            <Tabs value={formData.category} onValueChange={(value) => handleChange('category', value)}>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {formData.name || "Select a chore template"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search chore templates..." />
                        <CommandEmpty>No chore template found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-72">
                            {choreTemplates
                              .filter((template) => template.category === category.name)
                              .map((template) => (
                                <CommandItem
                                  key={template.name}
                                  onSelect={() => handleTemplateSelect(template.name)}
                                >
                                  {React.createElement(template.icon, { className: "mr-2 h-4 w-4" })}
                                  {template.name}
                                </CommandItem>
                              ))}
                          </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </TabsContent>
              ))}
            </Tabs>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => handleChange('isRecurring', checked as boolean)}
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
