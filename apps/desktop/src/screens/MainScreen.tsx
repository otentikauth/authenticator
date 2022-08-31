import { useEffect, useState } from 'react'
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

  // Progress bar timer countdown
  const [startTimer, setStartTimer] = useState(false)
  const [percentage, setPercentage] = useState(100)
  const [seconds, setSeconds] = useState(0)

  // Fetch decrypted vaults data.
  const { isLoading, error, data, refetch }: any = useGetCollections(filter)

  useEffect(() => {
    if (isFetching) {
      setStartTimer(true)
      setPercentage(100)
      setSeconds(30)
    }

    const myInterval = setInterval(() => {
      if (data.length > 0 && startTimer && seconds > 0) {
        setPercentage(Math.trunc((300 * seconds) / 100))
        setSeconds(seconds - 1)
      }
      if (seconds === 0) {
        setStartTimer(false)
        setPercentage(100)
        setSeconds(30)
      }
    }, 1000)

    return () => clearInterval(myInterval)
  }, [startTimer, isFetching, seconds, data])

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
      <ProgressBar percentage={percentage} />
      <div className="scrollbar-hide relative -mx-1 h-[536px] overflow-y-auto overscroll-auto bg-gray-50 p-0 pt-14 dark:bg-gray-900">
        {/* <div className="w-full px-4 py-2">{seconds === 0 ? null : seconds}</div> */}
        <ItemsList data={data} />
      </div>
      {isFetching && <LoadingIndicator />}
      <FormCreate />
    </div>
  )
}
