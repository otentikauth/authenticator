import { useRef, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { toast } from 'react-hot-toast'

import { useStores } from '../stores/stores'
import { addSingleCollection } from '../utils/supabase'
import { DialogTransition } from './DialogTransition'
import { classNames } from '../utils/ui-helpers'
import { encryptStr, isAlphaNumeric } from '../utils/string-helpers'
import { useAuth } from '../hooks/useAuth'

export const FormCreate = () => {
  const session = useAuth()
  const [loading, setLoading] = useState(false)
  const formCreateOpen = useStores((state) => state.formCreateOpen)
  const setFormCreateOpen = useStores((state) => state.setFormCreateOpen)
  const setForceFetch = useStores((state) => state.setForceFetch)
  const cancelButtonRef = useRef(null)

  const [issuerName, setIssuerName] = useState('')
  const [userIdentity, setUserIdentity] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [backupCode, setBackupCode] = useState('')

  const resetForm = () => {
    setIssuerName('')
    setUserIdentity('')
    setSecretKey('')
    setBackupCode('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Check if secret key is valid (at least 120 bits in length)
    if (secretKey.length < 16 || !isAlphaNumeric(secretKey)) {
      toast.error('Secret key must be alphanumeric and at least 16 characters long!')
      return setLoading(false)
    }

    // Encrypt sensitive data with user's master key
    const issuer = await encryptStr(issuerName)
    const user_identity = await encryptStr(userIdentity)
    const secret = await encryptStr(secretKey)
    const backup_code = backupCode !== '' ? await encryptStr(backupCode) : null
    // const iconPath = iconPath !== '' ? await encryptStr(iconPath) : null

    const { error } = await addSingleCollection({
      user_id: session?.user?.id,
      issuer,
      user_identity,
      secret,
      backup_code,
      algorithm: 'SHA1',
      kind: 'TOTP',
      period: 30,
      digits: 6,
    })

    setLoading(false)

    if (error) {
      if (parseInt(error.code) === 23505) {
        return toast.error('Item already exists!')
      }
      return toast.error(error.message)
    }

    toast.success('Item saved!')
    setFormCreateOpen(false)
    setForceFetch(true)
    resetForm()
  }

  const handleCancel = () => {
    resetForm()
    setFormCreateOpen(false)
  }

  return (
    <DialogTransition isOpen={formCreateOpen} className="mt-2 flex h-full items-start justify-center px-4">
      <Dialog.Panel className="relative w-full rounded-lg bg-white px-5 pt-5 pb-6 text-left shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div>
              <label htmlFor="issuer-name" className="px-0.5 text-sm font-medium text-gray-600">
                Service name / issuer
              </label>
              <div className="mt-1">
                <input
                  id="issuer-name"
                  name="issuer_name"
                  type="text"
                  className="w-full rounded-md border border-gray-200 p-2 text-sm  placeholder-gray-400 hover:shadow focus:border-gray-500 focus:outline-none"
                  onChange={(e) => setIssuerName(e.target.value)}
                  defaultValue={issuerName}
                  placeholder="Google"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="user-identity" className="px-0.5 text-sm font-medium text-gray-600">
                Username / email address
              </label>
              <div className="mt-1">
                <input
                  id="user-identity"
                  name="user_identity"
                  type="text"
                  className="w-full rounded-md border border-gray-200 p-2 text-sm placeholder-gray-400 hover:shadow focus:border-gray-500 focus:outline-none"
                  onChange={(e) => setUserIdentity(e.target.value)}
                  defaultValue={userIdentity}
                  placeholder={session?.user?.email}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="secretkey" className="px-0.5 text-sm font-medium text-gray-600">
                Secret key
              </label>
              <div className="mt-1">
                <input
                  id="secretkey"
                  name="secretkey"
                  type="text"
                  className="w-full rounded-md border border-gray-200 p-2 text-sm  placeholder-gray-400 hover:shadow focus:border-gray-500 focus:outline-none"
                  onChange={(e) => setSecretKey(e.target.value)}
                  defaultValue={secretKey}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="backup-code" className="px-0.5 text-sm font-medium text-gray-600">
                Backup code (optional)
              </label>
              <div className="mt-1">
                <textarea
                  rows={2}
                  id="backup-code"
                  name="backup_code"
                  className="focus:border-brand-500 focus:ring-brand-500 block w-full rounded-md border-gray-300  placeholder-gray-400 shadow-sm sm:text-sm"
                  onChange={(e) => setBackupCode(e.target.value)}
                  defaultValue={backupCode}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              className={classNames(
                loading ? 'bg-gray-100 text-gray-400 ' : 'bg-white text-gray-700',
                'focus:ring-brand-500 inline-flex w-full justify-center rounded-md border border-gray-300 px-4 py-1.5 text-base font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm'
              )}
              onClick={handleCancel}
              ref={cancelButtonRef}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={classNames(
                loading ? 'border-gray-300 bg-gray-100 text-gray-400' : 'bg-brand-600 text-white',
                'hover:bg-brand-700 focus:ring-brand-500 inline-flex w-full justify-center rounded-md border border-transparent px-4 py-1.5 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm'
              )}
              disabled={loading}
            >
              Save
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </DialogTransition>
  )
}
