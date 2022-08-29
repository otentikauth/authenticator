import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { sbClient } from '../utils/supabase'

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    setSession(sbClient.auth.session())

    const { data: authListener } = sbClient.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [session])

  return session
}
