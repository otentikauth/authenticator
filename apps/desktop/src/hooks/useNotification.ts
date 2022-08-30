import { useEffect, useState } from 'react'
import { isPermissionGranted, requestPermission } from '@tauri-apps/api/notification'

export const useNotification = () => {
  const [allowNotification, setAllowNotification] = useState(false)

  const checkNotificationPermission = async () => {
    let permissionGranted = await isPermissionGranted()

    if (!permissionGranted) {
      const permission = await requestPermission()
      permissionGranted = permission === 'granted'
    }

    setAllowNotification(permissionGranted)
  }

  useEffect(() => {
    checkNotificationPermission()
  }, [])

  return allowNotification
}
