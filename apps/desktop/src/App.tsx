import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { QueryClientProvider } from '@tanstack/react-query'
import { Offline, Online } from 'react-detect-offline'
import { toast } from 'react-hot-toast'

import { disableBrowserEvents } from './utils/ui-helpers'
import { useStores } from './stores/stores'
import { useAuth } from './hooks/useAuth'

import { TitleBar } from './components/TitleBar'
import { ExitButton } from './components/ExitButton'
import { OfflineScreen } from './screens/OfflineScreen'
import { AuthScreen } from './screens/AuthScreen'
import { MainScreen } from './screens/MainScreen'
import { queryClient } from './utils/queries'

const offlineDetectConfig = {
  url: 'https://ifconfig.me/ip',
  enabled: true,
  interval: 5000,
  timeout: 5000,
}

export default function App() {
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

  if (!session) return <AuthScreen />

  return (
    <div className="mx-auto max-w-sm">
      <TitleBar />

      <Offline polling={offlineDetectConfig} onChange={(online) => handleOffline(online)}>
        <ExitButton />
        <OfflineScreen />
      </Offline>

      <Online polling={offlineDetectConfig} onChange={(online) => handleOnline(online)}>
        <QueryClientProvider client={queryClient}>
          <MainScreen />
        </QueryClientProvider>
      </Online>
    </div>
  )
}
