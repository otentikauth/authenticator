import { useState } from 'react'
import { useIsFetching } from '@tanstack/react-query'

import { useStores } from '../stores/stores'
import { useGetCollections } from '../hooks/useGetCollections'

import { AppMenu } from '../components/AppMenu'
import { FormCreate } from '../components/FormCreate'
import { ItemsList } from '../components/ItemsList'
import { ProgressBar } from '../components/ProgressBar'
import { SearchBar } from '../components/SearchBar'
import { LoaderScreen } from '../components/LoaderScreen'
import { LoadingIndicator } from '../components/LoadingIndicator'

import { ErrorScreen } from './ErrorScreen'
import { LockScreen } from './LockScreen'

export const MainScreen = (): JSX.Element => {
  const isFetching = useIsFetching()
  const locked = useStores((state) => state.locked)
  const forceFetch = useStores((state) => state.forceFetch)
  const setForceFetch = useStores((state) => state.setForceFetch)
  const [filter, setFilter] = useState('')

  // Fetch decrypted vaults data.
  // TODO: Use LyraSearch for local search indexing.
  // const { isLoading, error, data, isFetching, refetch }: any = useLoadCollection(filter)
  const { isLoading, error, data, refetch }: any = useGetCollections({ filter })

  if (isLoading && !filter) return <LoaderScreen />
  if (!locked && error) return <ErrorScreen message={error.message} />

  if (forceFetch) {
    refetch()
    setForceFetch(false)
  }

  return (
    <div className="z-40 pt-16">
      <AppMenu />
      <LockScreen />
      <SearchBar keyword={filter} setKeyword={setFilter} />
      <ProgressBar percentage={100} />
      <div className="scrollbar-hide relative -mx-1 h-[536px] overflow-y-auto overscroll-auto bg-gray-50 p-0 pt-14 dark:bg-gray-900">
        <ItemsList data={data} />
      </div>
      {isFetching && <LoadingIndicator />}
      <FormCreate />
    </div>
  )
}
