import { QueryClient } from '@tanstack/react-query'
import { parseCollections } from './array-helpers'
import { sbClient } from './supabase'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

export async function fetchVault() {
  // TODO: check again for selected data
  const { data } = await sbClient.from('vaults').select()
  const collections = await parseCollections(data || [])

  return collections
}
