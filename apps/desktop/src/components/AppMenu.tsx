import { Fragment, useEffect, useState } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { ask, open, save } from '@tauri-apps/api/dialog'
import { listen } from '@tauri-apps/api/event'
import type { EventName } from '@tauri-apps/api/event'

import { Menu, Transition } from '@headlessui/react'
import {
  LockClosedIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  DocumentPlusIcon,
  XCircleIcon,
  ArrowUturnUpIcon,
  ArrowUturnDownIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon } from '@heroicons/react/24/solid'

import { useStores } from '../stores/stores'
import { classNames } from '../utils/ui-helpers'
import { sbClient } from '../utils/supabase'
import { MenuDivider } from './MenuDivider'
import { exportCollections, importCollections } from '../utils/import-export'
import { toast } from 'react-hot-toast'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const AppMenu = () => {
  const locked = useStores((state) => state.locked)
  const setLockStreenState = useStores((state) => state.setLockStreenState)
  const setFormCreateOpen = useStores((state) => state.setFormCreateOpen)
  const setForceFetch = useStores((state) => state.setForceFetch)

  const [menuPayload, setMenuPayload] = useState<EventName | undefined | unknown>('')
  const [listenTauriEvent, setListenTauriEvent] = useState(false)

  useEffect(() => {
    // Listen tauri event
    listen('menu-event', (e) => {
      console.log('LISTEN', e.payload)
      setMenuPayload(e.payload)
      setListenTauriEvent(true)
    })
  }, [setMenuPayload, setListenTauriEvent])

  useEffect(() => {
    if (listenTauriEvent) {
      switch (menuPayload) {
        case 'quit':
          handleQuit()
          break

        case 'close':
          handleQuit()
          break

        case 'export':
          handleExport()
          break

        case 'import':
          handleImport()
          break

        case 'lock_vault':
          setLockStreenState(true)
          break

        case 'new_item':
          setFormCreateOpen(true)
          break

        case 'signout':
          handleSignOut()
          break

        case 'sync_vault':
          setForceFetch(true)
          break

        case 'update_check':
          break

        default:
          break
      }
    }
    setListenTauriEvent(false)
  }, [listenTauriEvent, menuPayload])

  // Reset all states before quit.
  const resetStates = () => {
    setLockStreenState(true)
    setFormCreateOpen(false)
  }

  const handleImport = async () => {
    // Open a selection dialog for backup file
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: 'Backup File',
          extensions: ['csv', 'json'],
        },
      ],
    })

    if (Array.isArray(selected)) {
      // user selected multiple files
    } else if (selected === null) {
      // user cancelled the selection
      toast.error('Canceled!')
    } else {
      // user selected a single file
      await importCollections(selected)
    }
  }

  const handleExport = async () => {
    const filePath = await save({
      filters: [
        {
          name: 'Backup File',
          extensions: ['json'],
        },
      ],
    })

    await exportCollections(filePath)
  }

  const handleQuit = async () => {
    const yes = await ask('Are you sure?', { title: 'Confirm exit', type: 'warning' })
    if (yes) {
      resetStates()
      // wait for screen locked before quitting
      await delay(1000)
      appWindow.close()
    }
  }

  const handleSignOut = async () => {
    const yes = await ask('Are you sure?', { title: 'Confirm sign out', type: 'warning' })
    if (yes) {
      resetStates()
      sbClient.auth.signOut().catch(console.error)
    }
  }

  return (
    <div className="absolute top-0 right-0 z-30 flex h-14 items-center px-4">
      <Menu as="div" className="relative">
        <div>
          <Menu.Button className="-mr-1 flex cursor-pointer items-center justify-center rounded-md p-1.5 outline-none hover:bg-gray-700">
            <Bars3Icon className="h-6 w-6 text-white" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-1 mt-2 w-52 origin-top-right rounded bg-white shadow ring-1 ring-black/5 focus:outline-none dark:bg-gray-700">
            {!locked && (
              <>
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <button
                      type="button"
                      className={classNames(
                        active ? 'bg-gray-100 dark:bg-gray-500' : '',
                        'inline-flex w-full items-center justify-between rounded-t px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-100'
                      )}
                      onClick={() => setFormCreateOpen(true)}
                    >
                      <span>New item</span>
                      <DocumentPlusIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                    </button>
                  )}
                </Menu.Item>
                <MenuDivider />
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <button
                      type="button"
                      className={classNames(
                        active ? 'bg-gray-100 dark:bg-gray-500' : '',
                        'inline-flex w-full items-center justify-between px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-100'
                      )}
                      onClick={() => setForceFetch(true)}
                    >
                      <span>Sync Vault</span>
                      <ArrowPathIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                    </button>
                  )}
                </Menu.Item>
                <MenuDivider />
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <button
                      type="button"
                      className={classNames(
                        active ? 'bg-gray-100 dark:bg-gray-500' : '',
                        'inline-flex w-full items-center justify-between rounded-b px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-100'
                      )}
                      onClick={handleImport}
                    >
                      <span>Import</span>
                      <ArrowUturnDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <button
                      type="button"
                      className={classNames(
                        active ? 'bg-gray-100 dark:bg-gray-500' : '',
                        'inline-flex w-full items-center justify-between rounded-b px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-100'
                      )}
                      onClick={handleExport}
                    >
                      <span>Export</span>
                      <ArrowUturnUpIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                    </button>
                  )}
                </Menu.Item>
                <MenuDivider />
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <button
                      type="button"
                      className={classNames(
                        active ? 'bg-gray-100 dark:bg-gray-500' : '',
                        'inline-flex w-full items-center justify-between rounded-b px-5  py-2.5 text-sm font-medium text-gray-700 dark:text-gray-100'
                      )}
                      onClick={() => setLockStreenState(true)}
                    >
                      <span>Lock Vault</span>
                      <LockClosedIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                    </button>
                  )}
                </Menu.Item>
              </>
            )}
            <Menu.Item>
              <button
                type="button"
                className={classNames(
                  locked ? 'rounded-t' : '',
                  'inline-flex w-full items-center justify-between px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-100 hover:dark:bg-gray-500'
                )}
                onClick={handleSignOut}
              >
                <span>Sign out</span>
                <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
              </button>
            </Menu.Item>
            <MenuDivider />
            <Menu.Item>
              {({ active }: { active: boolean }) => (
                <button
                  type="button"
                  className={classNames(
                    active ? 'bg-gray-100 dark:bg-gray-500' : '',
                    'inline-flex w-full items-center justify-between rounded-b px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-100'
                  )}
                  onClick={handleQuit}
                >
                  <span>Quit</span>
                  <XCircleIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
