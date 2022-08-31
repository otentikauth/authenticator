import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'

import { useStores } from '../stores/stores'
import { classNames } from '../utils/ui-helpers'
import { DialogTransition } from '../components/DialogTransition'
import { LoaderScreen } from '../components/LoaderScreen'
import { updateDeviceInfo } from '../utils/supabase'
import { validatePassphrase } from '../utils/guards'

export const LockScreen = () => {
  const locked = useStores((state) => state.locked)
  const setLockStreenState = useStores((state) => state.setLockStreenState)
  const [error, setError] = useState<any>({ error: null, text: null })
  const [password, setPassphrase] = useState('')
  const [inputType, setInputType] = useState('password')
  const [loading, setLoading] = useState(false)

  const handleShowHidePassword = () => {
    setInputType(inputType === 'password' ? 'text' : 'password')
  }

  const handleUnlockAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password.length <= 1) {
      return setError({ error: true, text: 'Your password required!' })
    }

    setLoading(true)
    // Compare with hashed passphrase in localStorage
    const validPassphrase = await validatePassphrase(password)
    setLoading(false)

    if (!validPassphrase) {
      return setError({ error: true, text: 'Invalid password!' })
    }

    // Update device information.
    await updateDeviceInfo()

    setError(null)
    setLoading(false)
    setLockStreenState(false)
  }

  if (loading) return <LoaderScreen />

  return (
    <DialogTransition isOpen={locked} className="z-20 flex h-full items-center justify-center px-4">
      <Dialog.Panel className="relative w-full rounded-lg bg-white px-4 py-5 text-left shadow-lg">
        <form onSubmit={handleUnlockAction}>
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <LockClosedIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Vault locked
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Enter your password to unlock the collection.</p>
              </div>

              <div className="mt-2">
                <label htmlFor="password" className="sr-only">
                  Passphrase
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type={inputType}
                    name="password"
                    id="password"
                    className={classNames(
                      error &&
                        'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 ',
                      'block w-full rounded-md pr-10 focus:outline-none sm:text-sm'
                    )}
                    onChange={(e) => {
                      setError(null)
                      setPassphrase(e.target.value)
                    }}
                    aria-invalid="true"
                  />

                  {error ? (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {inputType === 'password' ? (
                        <EyeSlashIcon
                          className="h-5 w-5 text-gray-400"
                          onClick={handleShowHidePassword}
                          aria-hidden="true"
                        />
                      ) : (
                        <EyeIcon
                          className="h-5 w-5 text-gray-400"
                          onClick={handleShowHidePassword}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  )}
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error.text}</p>}
              </div>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
            >
              Unlock Vault
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </DialogTransition>
  )
}
