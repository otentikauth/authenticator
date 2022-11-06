import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { sbClient } from '../utils/supabase'

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)

  // TODO: migrate to Supabase SDK v2
  useEffect(() => {
    setSession(sbClient.auth.session())

    const { data: authListener } = sbClient.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
    })

    // TODO: migrate to Supabase SDK v2
    return () => {
      authListener?.unsubscribe()
      // sbClient.removeChannel(userListener)
    }
  }, [session])

  return session
}
