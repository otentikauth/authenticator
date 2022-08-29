import { QueryClient } from '@tanstack/react-query'
import { parseCollections } from './array-helpers'
import { filter as arrayFilter } from 'smart-array-filter'
import { sbClient } from './supabase'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

export async function fetchVault(filter: string) {
  // TODO: check again for selected data
  const { data } = await sbClient.from('vaults').select()
  const collections = await parseCollections(data || [])

  if (filter) {
    return arrayFilter(collections, {
      keywords: filter,
      caseSensitive: false,
    })
  }

  return collections
}
