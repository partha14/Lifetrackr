import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import AddPurchaseForm from '../components/AddPurchaseForm'
import LoadingSpinner from '../components/LoadingSpinner'
import EditPurchaseForm from '../components/EditPurchaseForm'
import Layout from '../components/Layout'
import { toast, Toaster } from 'react-hot-toast'
import styles from '../styles/Dashboard.module.css'
import { handleError } from '../utils/errorHandler'
import { Purchase } from '../types/Purchase'
import { differenceInMonths } from 'date-fns'
import { FaShoppingCart, FaPlus, FaSync, FaDollarSign, FaCalendarAlt, FaShieldAlt, FaStickyNote, FaTrash, FaEdit } from 'react-icons/fa'

const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [showAddPurchase, setShowAddPurchase] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user_id, setUserId] = useState<string | null>(null)
  const [totalSpending, setTotalSpending] = useState<number>(0)
  const router = useRouter()

  const calculateRemainingWarranty = useMemo(() => (endDate: string | null | undefined): number => {
    if (!endDate) return 0;
    const today = new Date()
    const warrantyEndDate = new Date(endDate)
    const remainingMonths = differenceInMonths(warrantyEndDate, today)
    return Math.max(0, remainingMonths)
  }, [])

  const getUserId = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        router.push('/login')
      }
    } catch (error) {
      handleError(error, 'Failed to get user information')
    }
  }, [router])

  useEffect(() => {
    getUserId()
  }, [getUserId])

  const fetchPurchases = useCallback(async () => {
    if (!user_id) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user_id)
        .order('date', { ascending: false })

      if (error) throw error
      
      setPurchases(data || [])
      const total = (data || []).reduce((sum, purchase) => sum + purchase.price, 0)
      setTotalSpending(total)
    } catch (error) {
      handleError(error, 'Failed to fetch purchases')
    } finally {
      setIsLoading(false)
    }
  }, [user_id])

  useEffect(() => {
    if (user_id) {
      fetchPurchases()
    }
  }, [user_id, fetchPurchases])

  const handleAddPurchase = () => {
    setShowAddPurchase(!showAddPurchase)
  }

  const handlePurchaseAdded = () => {
    fetchPurchases()
    setShowAddPurchase(false)
  }

  const handleEditPurchase = (purchase: Purchase) => {
    setEditingPurchase(purchase)
  }

  const handlePurchaseEdited = () => {
    fetchPurchases()
    setEditingPurchase(null)
  }

  const handleDeletePurchase = async (id: string) => {
    const result = await new Promise<boolean>((resolve) => {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this purchase?')) {
        resolve(true)
      } else {
        resolve(false)
      }
    })

    if (result) {
      try {
        const { error } = await supabase
          .from('purchases')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        
        toast.success('Purchase deleted successfully')
        fetchPurchases()
      } catch (error) {
        handleError(error, 'Failed to delete purchase')
        toast.error('Failed to delete purchase. Please try again.')
      }
    }
  }

  if (!user_id) {
    return <LoadingSpinner>Loading user data...</LoadingSpinner>
  }

  return (
    <Layout>
      <div className={styles.pageContent}>
        <Toaster position="top-center" reverseOrder={false} />
        <div className={styles.headerContainer}>
          <h1 className={styles.title}><FaShoppingCart /> My Purchases</h1>
          <div className={styles.buttonGroup}>
            <button onClick={handleAddPurchase} className={`${styles.button} ${styles.addButton}`}>
              <FaPlus /> {showAddPurchase ? 'Hide' : 'Add Purchase'}
            </button>
            <button onClick={fetchPurchases} className={`${styles.button} ${styles.refreshButton}`}>
              <FaSync /> Refresh
            </button>
          </div>
        </div>
        <div className={styles.totalSpending}>
          <h2>Total Spending: ${totalSpending.toFixed(2)}</h2>
        </div>
        {showAddPurchase && user_id && <AddPurchaseForm onPurchaseAdded={handlePurchaseAdded} user_id={user_id} />}
        {editingPurchase && (
          <EditPurchaseForm
            purchase={editingPurchase}
            onPurchaseEdited={handlePurchaseEdited}
            onCancel={() => setEditingPurchase(null)}
          />
        )}
        {isLoading ? (
          <LoadingSpinner />
        ) : purchases.length > 0 ? (
          <div className={styles.cardGrid}>
            {purchases.map((purchase) => (
              <div key={purchase.id} className={styles.card}>
                <h3 className={styles.purchaseTitle}>{purchase.name}</h3>
                <p className={styles.purchasePrice}>
                  <FaDollarSign className={styles.icon} /> {purchase.price.toFixed(2)}
                </p>
                <p className={styles.purchaseDate}>
                  <FaCalendarAlt className={styles.icon} /> {new Date(purchase.date).toLocaleDateString()}
                </p>
                {purchase.warranty_end_date && (
                  <p className={styles.purchaseWarranty}>
                    <FaShieldAlt className={styles.icon} /> Warranty: {calculateRemainingWarranty(purchase.warranty_end_date)} months remaining
                  </p>
                )}
                {purchase.notes && <p className={styles.purchaseNotes}><FaStickyNote className={styles.icon} /> Notes: {purchase.notes}</p>}
                <div className={styles.buttonGroup}>
                  <button onClick={() => handleEditPurchase(purchase)} className={`${styles.editButton} ${styles.button}`}>
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDeletePurchase(purchase.id.toString())} className={`${styles.deleteButton} ${styles.button}`}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noPurchases}>
            <FaShoppingCart className={styles.noPurchasesIcon} />
            <p>You haven't added any purchases yet.</p>
            <p>Click the "Add Purchase" button to get started!</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Purchases