import { Fragment } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { ask, open, save } from '@tauri-apps/api/dialog'
// import { checkUpdate } from '@tauri-apps/api/updater'

import { Menu, Transition } from '@headlessui/react'
import {
  LockClosedIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  DocumentPlusIcon,
  XCircleIcon,
  ArchiveBoxIcon,
  ArrowDownOnSquareIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { useHotkeys } from 'react-hotkeys-hook'

import { useStores } from '../stores/stores'
import { classNames } from '../utils/ui-helpers'
import { sbClient } from '../utils/supabase'
import { MenuDivider } from './MenuDivider'
import { exportCollections, importCollections } from '../utils/import-export'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const AppMenu = () => {
  const locked = useStores((state) => state.locked)
  const setLockStreenState = useStores((state) => state.setLockStreenState)
  const setFormCreateOpen = useStores((state) => state.setFormCreateOpen)
  const setForceFetch = useStores((state) => state.setForceFetch)

  // Reset all states before quit.
  const resetStates = () => {
    setLockStreenState(true)
    setFormCreateOpen(false)
  }

  const handleImport = async () => {
    // Open a selection dialog for image files
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

  const handleUpdate = async () => {
    try {
      // TODO: enable auto update check
    } catch (error) {
      console.error(error)
    }
  }

  const handleSignOut = () => {
    resetStates()
    sbClient.auth.signOut().catch(console.error)
  }

  // Keyboard shortcut for lock screen
  useHotkeys('ctrl+l, command+l', () => setLockStreenState(true))

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
          <Menu.Items className="absolute right-1 mt-2 w-48 origin-top-right rounded bg-white shadow ring-1 ring-black/5 focus:outline-none dark:bg-gray-700">
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
                      <CogIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }: { active: boolean }) => (
                    <button
                      type="button"
                      className={classNames(
                        active ? 'bg-gray-100 dark:bg-gray-500' : '',
                        'inline-flex w-full items-center justify-between px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-100'
                      )}
                      onClick={handleUpdate}
                    >
                      <span>Check for Updates</span>
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
                      <ArrowDownOnSquareIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
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
                      <ArchiveBoxIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
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
