import { useEffect, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { sendNotification } from '@tauri-apps/api/notification'
import { Offline, Online } from 'react-detect-offline'
import { toast } from 'react-hot-toast'

import { disableBrowserEvents } from './utils/ui-helpers'
import { useAuth } from './hooks/useAuth'

import { TitleBar } from './components/TitleBar'
import { ExitButton } from './components/ExitButton'
import { OfflineScreen } from './screens/OfflineScreen'
import { AuthScreen } from './screens/AuthScreen'
import { MainScreen } from './screens/MainScreen'
import { queryClient } from './utils/queries'
import { useNotification } from './hooks/useNotification'

const offlineDetectConfig = {
  url: 'https://ifconfig.me/ip',
  enabled: true,
  interval: 5000,
  timeout: 5000,
}

export default function App() {
  const session = useAuth()
  const allowNotification = useNotification()

  useEffect(() => {
    disableBrowserEvents('contextmenu')
    disableBrowserEvents('selectstart')
  })

  const handleOffline = (online: boolean) => {
    if (!online) {
      const message = 'Your internet connection is lost!'
      return allowNotification
        ? sendNotification({ title: 'Otentik Authenticator', body: message })
        : toast.error(message)
    }
  }

  const handleOnline = (online: boolean) => {
    if (online) {
      const message = 'Your internet connection is back!'
      return allowNotification
        ? sendNotification({ title: 'Otentik Authenticator', body: message })
        : toast.success(message)
    }
  }

  if (!session) return <AuthScreen />

  return (
    <div className="mx-auto max-w-sm">
      <TitleBar />

      <Offline
        polling={offlineDetectConfig}
        onChange={(online) => {
          handleOffline(online)
        }}
      >
        <ExitButton />
        <OfflineScreen />
      </Offline>

      <Online
        polling={offlineDetectConfig}
        onChange={(online) => {
          handleOnline(online)
        }}
      >
        <QueryClientProvider client={queryClient}>
          <MainScreen />
        </QueryClientProvider>
      </Online>
    </div>
  )
}
