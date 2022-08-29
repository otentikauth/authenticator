import { FC, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

type FormCreateProps = {
  children: React.ReactNode
  className?: string
  isOpen: boolean
  initialFocus?: React.MutableRefObject<HTMLElement | null> | undefined
}

export const DialogTransition: FC<FormCreateProps> = (props) => {
  const { children, isOpen, className, initialFocus } = props

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" initialFocus={initialFocus} onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="scrollbar-hide fixed inset-0 z-10 -mx-1 h-full min-h-screen overflow-auto overscroll-auto pt-16">
          <div className={className}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 trangray-y-4 sm:trangray-y-0 sm:scale-95"
              enterTo="opacity-100 trangray-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 trangray-y-0 sm:scale-100"
              leaveTo="opacity-0 trangray-y-4 sm:trangray-y-0 sm:scale-95"
            >
              {children}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
