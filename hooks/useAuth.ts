import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import { handleError } from '../utils/errorHandler'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      setLoading(false)
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    checkUser()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      handleError(error, 'Error checking user')
    } finally {
      setLoading(false)
    }
  }

  return { user, loading }
}
