import { createClient } from '@supabase/supabase-js'
// import { fetch as tauriFetch } from '@tauri-apps/api/http'

// @ts-ignore
export const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env

const defaultOptions = {}

export const sbClient = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, defaultOptions)

export const addSingleCollection = async (data: any) => {
  return await sbClient.from('vaults').insert(data).single()
}
