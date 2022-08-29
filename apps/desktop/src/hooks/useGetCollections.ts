import { useQuery } from '@tanstack/react-query'
import { useStores } from '../stores/stores'
import { fetchVault } from '../utils/queries'

export const useGetCollections = (filter: string) => {
  const locked = useStores((state) => state.locked)
  const refreshTime = 30000 // How frequently you want to refresh the data, in ms

  return useQuery(['vaults', filter], () => fetchVault(filter), {
    initialData: [],
    refetchInterval: refreshTime,
    // select: (data: any) => data.find((item: any) => item),
    // Only fetch when screen unloced
    enabled: !locked,
  })
}
