import { generatePassphrase } from './string-helpers'
import { localData } from '../utils/storage'
import { sbClient } from './supabase'

export const validatePassphrase = async (password: string): Promise<boolean> => {
  const userId = sbClient.auth.session()?.user?.id || ''
  const storedPassphrase = await localData.get('passphrase')
  const hashedPassphrase = await generatePassphrase(userId, password)

  return hashedPassphrase === storedPassphrase ? true : false
}
