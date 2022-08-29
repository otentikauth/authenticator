import { FC, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { DialogTransition } from './DialogTransition'

interface ConfirmDialogProps {
  children: React.ReactNode
  title: string
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmDialog: FC<ConfirmDialogProps> = (props) => {
  const { children, open, onClose, title, onConfirm } = props
  const cancelButtonRef = useRef(null)

  return !open ? (
    <></>
  ) : (
    <DialogTransition
      isOpen={open}
      initialFocus={cancelButtonRef}
      className="flex h-full items-center justify-center px-6"
    >
      <Dialog.Panel className="relative w-full rounded-lg bg-white px-4 py-5 text-left shadow-lg">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="mt-5 text-center sm:mt-5">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{children}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-flow-row-dense grid-cols-2 gap-3 sm:mt-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            onClick={onClose}
            ref={cancelButtonRef}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </Dialog.Panel>
    </DialogTransition>
  )
}
