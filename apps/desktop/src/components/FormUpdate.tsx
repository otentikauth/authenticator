import { FC, useRef, useState } from 'react'
import { Dialog } from '@headlessui/react'

import { DialogTransition } from './DialogTransition'
import { classNames } from '../utils/ui-helpers'
import { TrashIcon } from '@heroicons/react/24/outline'
import { sbClient } from '../utils/supabase'
import toast from 'react-hot-toast'
import { useStores } from '../stores/stores'
import { LoaderScreen } from './LoaderScreen'
import { ConfirmDialog } from './ConfirmDialog'
import { encryptStr } from '../utils/string-helpers'

interface FormUpdateProps {
  data: any
  open: boolean
  onClose: () => void
}

export const FormUpdate: FC<FormUpdateProps> = (props) => {
  const { open, onClose, data } = props
  const setForceFetch = useStores((state) => state.setForceFetch)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelButtonRef = useRef(null)

  const [issuerName, setIssuerName] = useState(data.issuer)
  const [userIdentity, setUserIdentity] = useState(data.user_identity)
  const [secretKey, setSecretKey] = useState(data.secret)
  const [backupCode, setBackupCode] = useState(data.backup_code)

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await sbClient.from('vaults').delete().match({ id: data.id })
    setLoading(false)

    if (error) return toast.error(error.message)

    setForceFetch(true)
    toast.success('Token deleted!')

    return onClose()
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Encrypt sensitive data with user's master key
    const issuer = await encryptStr(issuerName)
    const user_identity = await encryptStr(userIdentity)
    const secret = await encryptStr(secretKey)
    const backup_code = backupCode && (await encryptStr(backupCode))
    // const iconPath = iconPath !== '' ? await encryptStr(iconPath) : null

    const { error } = await sbClient
      .from('vaults')
      .update({
        issuer,
        user_identity,
        secret,
        backup_code,
        algorithm: 'SHA1',
        kind: 'TOTP',
        period: 30,
        digits: 6,
      })
      .match({ id: data.id })

    setLoading(false)

    if (error) {
      // if (parseInt(error.code) === 23505) {
      //   return toast.error('Item already exists!')
      // }
      return toast.error(error.message)
    }

    setForceFetch(true)
    toast.success('Item saved!')
    return onClose()
  }

  if (loading) return <LoaderScreen />

  return (
    <>
      <DialogTransition
        isOpen={open}
        initialFocus={cancelButtonRef}
        className="mt-2 flex h-full items-start justify-center px-4"
      >
        <Dialog.Panel className="relative w-full rounded-lg bg-white pb-6 text-left shadow-lg">
          <div className="relative flex h-12 w-full items-center justify-end rounded-t-lg bg-gray-100 px-4">
            <button
              type="button"
              className="-mr-1 flex cursor-pointer items-center justify-center rounded-md p-1.5 outline-none hover:bg-red-100"
              onClick={() => setConfirmOpen(true)}
              disabled={loading}
            >
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </div>
          <form className="mt-3 px-5" onSubmit={handleUpdate}>
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
                ref={cancelButtonRef}
                onClick={onClose}
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
                Update
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </DialogTransition>

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
        title="Delete Item?"
      >
        Are you sure you want to do this?
      </ConfirmDialog>
    </>
  )
}
