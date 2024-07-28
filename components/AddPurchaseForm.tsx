import React from 'react'
import styles from '../styles/Form.module.css'
import { useAddPurchaseForm } from '../hooks/useAddPurchaseForm'

interface AddPurchaseFormProps {
  onPurchaseAdded: () => void;
  user_id: string;
}

const AddPurchaseForm: React.FC<AddPurchaseFormProps> = ({ onPurchaseAdded, user_id }) => {
  const { formData, handleChange, handleSubmit } = useAddPurchaseForm(user_id, onPurchaseAdded)

  const isWarrantyPeriodValid = formData.warrantyPeriod !== '' && parseInt(formData.warrantyPeriod) > 0

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Item Name"
        required
        className={styles.input}
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        step="0.01"
        min="0"
        required
        className={styles.input}
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Notes"
        className={styles.textarea}
      />
      <div className={styles.warrantyGroup}>
        <input
          type="number"
          name="warrantyPeriod"
          value={formData.warrantyPeriod}
          onChange={handleChange}
          placeholder="Warranty Period"
          min="0"
          className={styles.input}
        />
        <select
          name="warrantyUnit"
          value={formData.warrantyUnit}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
      </div>
      {isWarrantyPeriodValid && (
        <div className={styles.inputGroup}>
          <label>Warranty End Date:</label>
          <input
            type="date"
            name="warranty_end_date"
            value={formData.warranty_end_date || ''}
            readOnly
            className={styles.input}
          />
        </div>
      )}
      <button type="submit" className={styles.button} disabled={!formData.name || parseFloat(formData.price) <= 0 || !formData.date}>Add Purchase</button>
    </form>
  )
}

export default AddPurchaseForm