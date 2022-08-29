import { useQuery } from '@tanstack/react-query'

import { parseCollections } from '../utils/array-helpers'
import { localData } from '../utils/storage'
import { sbClient } from '../utils/supabase'
import { useAuth } from './useAuth'

type GetCollectionType = {
  filter?: string
}

export const useGetCollections = ({ filter }: GetCollectionType) => {
  const refreshTime = 30000 // How frequently you want to refresh the data, in ms
  const userId = useAuth()?.user?.id

  return useQuery(
    ['vaults', filter],
    async () => {
      const { data } = await sbClient.from('vaults').select().match({ user_id: userId })
      const collections = await parseCollections(data || [])

      // Store to local data storage for cache.
      await localData.set('collections', collections)

      return collections
    },
    {
      initialData: [],
      refetchInterval: refreshTime,
      // select: (data: any) => data.find((item: any) => item),
    }
  )
}