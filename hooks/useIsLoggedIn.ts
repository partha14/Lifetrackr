import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export function useIsLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
      setLoading(false)
    }

    checkUser()
  }, [])

  return { isLoggedIn, loading }
}
