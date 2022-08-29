import { Fragment, useState } from 'react'

import { useStores } from '../stores/stores'
import { useGetCollections } from '../hooks/useGetCollections'

import { AppMenu } from './AppMenu'
import { FormCreate } from './FormCreate'
import { ItemsList } from './ItemsList'
import { LockScreen } from './LockScreen'
import { ProgressBar } from './ProgressBar'
import { SearchBar } from './SearchBar'
import { LoaderScreen } from './LoaderScreen'
import { LoadingIndicator } from './LoadingIndicator'
import { ErrorScreen } from './ErrorScreen'

export const MainScreen = (): JSX.Element => {
  const forceFetch = useStores((state) => state.forceFetch)
  const setForceFetch = useStores((state) => state.setForceFetch)
  const [filter, setFilter] = useState('')

  // Fetch decrypted vaults data.
  // TODO: Use LyraSearch for local search indexing.
  // const { isLoading, error, data, isFetching, refetch }: any = useLoadCollection(filter)
  const { isLoading, error, data, isFetching, refetch }: any = useGetCollections({ filter })

  if (isLoading && !filter) return <LoaderScreen />
  if (error) return <ErrorScreen message={error.message} />

  if (forceFetch) {
    refetch()
    setForceFetch(false)
  }

  // console.log('MAIN SCREEN', data)

  return (
    <Fragment>
      <AppMenu />
      <LockScreen />
      <SearchBar keyword={filter} setKeyword={setFilter} />
      <ProgressBar percentage={100} />
      <div className="scrollbar-hide relative -mx-1 h-[536px] overflow-y-auto overscroll-auto bg-gray-50 p-0 pt-14 dark:bg-gray-900">
        <ItemsList data={data} />
      </div>
      {isFetching && <LoadingIndicator />}
      <FormCreate />
    </Fragment>
  )
}
