import { useState, useCallback } from 'react'
import { supabase } from '../utils/supabaseClient'
import { toast } from 'react-hot-toast'
import { handleError } from '../utils/errorHandler'
import { addMonths, addYears, format } from 'date-fns'

interface FormData {
  name: string;
  price: string;
  date: string;
  notes: string;
  warrantyPeriod: string;
  warrantyUnit: 'months' | 'years';
  warranty_end_date: string | null;
}

export const useAddPurchaseForm = (user_id: string, onPurchaseAdded: () => void) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    warrantyPeriod: '',
    warrantyUnit: 'months',
    warranty_end_date: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'warrantyPeriod' || name === 'warrantyUnit') {
      updateWarrantyEndDate(name === 'warrantyPeriod' ? value : formData.warrantyPeriod, name === 'warrantyUnit' ? value as 'months' | 'years' : formData.warrantyUnit)
    }
  }

  const updateWarrantyEndDate = (period: string, unit: 'months' | 'years') => {
    const purchaseDate = new Date(formData.date)
    const warrantyPeriod = parseInt(period)

    if (!isNaN(warrantyPeriod) && warrantyPeriod > 0) {
      const endDate = unit === 'months' ? addMonths(purchaseDate, warrantyPeriod) : addYears(purchaseDate, warrantyPeriod)
      setFormData(prev => ({ ...prev, warranty_end_date: format(endDate, 'yyyy-MM-dd') }))
    } else {
      setFormData(prev => ({ ...prev, warranty_end_date: null }))
    }
  }

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('purchases')
        .insert([
          {
            user_id,
            name: formData.name,
            price: parseFloat(formData.price),
            date: formData.date,
            notes: formData.notes,
            warranty_end_date: formData.warranty_end_date,
          },
        ])

      if (error) throw error

      toast.success('Purchase added successfully!')
      onPurchaseAdded()
      setFormData({
        name: '',
        price: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
        warrantyPeriod: '',
        warrantyUnit: 'months',
        warranty_end_date: null,
      })
    } catch (error) {
      handleError(error)
    }
  }, [formData, user_id, onPurchaseAdded])

  return { formData, handleChange, handleSubmit }
}