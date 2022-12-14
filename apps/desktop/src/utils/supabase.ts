import { createClient } from '@supabase/supabase-js'
import { invoke } from '@tauri-apps/api/tauri'
// import { fetch as tauriFetch } from '@tauri-apps/api/http'

// @ts-ignore
export const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env

const defaultOptions = {}

export const sbClient = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, defaultOptions)

export const addSingleCollection = async (data: any) => {
  return await sbClient.from('vaults').insert(data).single()
}

export const storeDeviceInfo = async () => {
  const { device_uuid, os_platform, os_version, host_name } = await invoke('get_device_info')
  const session = sbClient.auth.session()

  const user_id = session?.user?.id
  const unique_id = await invoke('generate_udevice_id', { uid: user_id })
  const prepared = { user_id, device_uuid, unique_id, os_platform, os_version, host_name }

  return await sbClient.from('devices').upsert(prepared, { onConflict: 'unique_id' })
}

export const updateDeviceInfo = async () => {
  const session = sbClient.auth.session()
  const user_id = session?.user?.id
  const unique_id = await invoke('generate_udevice_id', { uid: user_id })
  const time = new Date().toISOString()

  return await sbClient.from('devices').update({ last_online_at: time }).match({ user_id, unique_id })
}
