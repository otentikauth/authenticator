import { db as vaultDB, insert, search } from '../utils/lyra-search'
import { useGetCollections } from './useGetCollections'

export const useLoadCollection = (filter: string) => {
  const { isLoading, error, data: rawData, isFetching, refetch }: any = useGetCollections()

  let searchResult
  if (rawData) {
    // TODO: remove duplicates from existing search index.
    rawData.map((item: any) => {
      insert(vaultDB, {
        collection_id: item.id,
        algorithm: item.algorithm,
        digits: item.digits,
        issuer: item.issuer,
        kind: item.kind,
        period: item.period,
        secret: item.secret,
        token: item.token,
        user_identity: item.user_identity,
      })
    })

    const { hits } = search(vaultDB, {
      properties: ['issuer', 'user_identity'],
      term: filter,
    })

    searchResult = hits
  }

  // If no filter defined then return the fetched data.
  const data = (filter || filter.length >= 1) && searchResult ? searchResult : rawData

  return { isLoading, error, data, isFetching, refetch }
}
