import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import styles from '../styles/Form.module.css'
import { handleError } from '../utils/errorHandler'
import { Purchase } from '../types/Purchase'
import { toast } from 'react-hot-toast'

interface EditPurchaseFormProps {
  purchase: Purchase
  onPurchaseEdited: () => void
  onCancel: () => void
}

const EditPurchaseForm: React.FC<EditPurchaseFormProps> = ({ purchase, onPurchaseEdited, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Purchase, 'price'> & { price: string }>(() => ({
    ...purchase,
    price: purchase.price.toString()
  }))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const price = parseFloat(formData.price)
      if (isNaN(price)) {
        throw new Error('Invalid price')
      }
      const updatedPurchase: Purchase = {
        ...formData,
        price
      }
      const { data, error } = await supabase
        .from('purchases')
        .update(updatedPurchase)
        .eq('id', purchase.id)
        .select()

      if (error) throw error

      toast.success('Purchase updated successfully!')
      onPurchaseEdited()
    } catch (error) {
      handleError(error, 'An error occurred while updating the purchase. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        name="name"
        value={formData.name || ''}
        onChange={handleChange}
        placeholder="Purchase Name"
        required
        className={styles.input}
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
        step="0.01"
        className={styles.input}
      />
      <input
        type="date"
        name="date"
        value={formData.date || ''}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <textarea
        name="notes"
        value={formData.notes || ''}
        onChange={handleChange}
        placeholder="Notes"
        className={styles.textarea}
      />
      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.button}>Update Purchase</button>
        <button type="button" onClick={onCancel} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
      </div>
    </form>
  )
}

export default EditPurchaseForm
