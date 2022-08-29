import { Transition } from '@headlessui/react'
import { Toaster, ToastIcon, resolveValue } from 'react-hot-toast'

export const ToastMessage = () => {
  return (
    <Toaster position="bottom-center" toastOptions={{ duration: 1800 }}>
      {(t) => (
        <Transition
          appear
          show={t.visible}
          className="z-50 flex transform rounded bg-white p-4 shadow-lg"
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <ToastIcon toast={t} />
          {/* eslint-disable */}
          {/* @ts-ignore */}
          <p className="px-2 text-sm">{resolveValue(t.message)}</p>
        </Transition>
      )}
    </Toaster>
  )
}
