import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Offline, Online } from 'react-detect-offline'
import { toast } from 'react-hot-toast'

import { disableBrowserEvents } from './utils/ui-helpers'
import { useAuth } from './hooks/useAuth'

import { MainScreen } from './components/MainScreen'
import { AuthScreen } from './components/AuthScreen'
import { useStores } from './stores/stores'
import { OfflineScreen } from './components/OfflineScreen'

const queryClient = new QueryClient()

const offlineDetectConfig = {
  url: 'https://ifconfig.me/ip',
  enabled: true,
  interval: 5000,
  timeout: 5000,
}

function App() {
  const session = useAuth()
  const setFormCreateOpen = useStores((state) => state.setFormCreateOpen)
  const setForceFetch = useStores((state) => state.setForceFetch)

  // Register keyboard shortcuts
  useHotkeys('ctrl+r, command+r', () => setForceFetch(true))
  useHotkeys('ctrl+n, command+n', () => setFormCreateOpen(true))

  useEffect(() => {
    disableBrowserEvents('contextmenu')
    disableBrowserEvents('selectstart')
  })

  const handleOffline = (online: boolean) => {
    !online && toast.error('Your internet connection is lost!')
  }

  const handleOnline = (online: boolean) => {
    online && toast.success('Your internet connection is back!')
  }

  if (!session) {
    return (
      <div className="pt-16">
        <AuthScreen />
      </div>
    )
  }

  return (
    <>
      <Offline polling={offlineDetectConfig} onChange={(online) => handleOffline(online)}>
        <OfflineScreen />
      </Offline>
      <Online polling={offlineDetectConfig} onChange={(online) => handleOnline(online)}>
        <QueryClientProvider client={queryClient}>
          <div className="pt-16">
            <MainScreen />
          </div>
        </QueryClientProvider>
      </Online>
    </>
  )
}

export default App
