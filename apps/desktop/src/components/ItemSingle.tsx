import { FC, useState } from 'react'
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import clipboard from 'clipboardy'
import { FormUpdate } from './FormUpdate'

interface ItemSingleProps {
  item: any
}

export const ItemSingle: FC<ItemSingleProps> = ({ item }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleCopy = (token: string) => {
    clipboard.write(token)
    toast.success('Token copied to clipboard!')
  }

  return (
    <>
      <li className="border-t border-gray-200 bg-gray-50 dark:bg-gray-900">
        <div className="focus-within:ring-brand-500 hover:bg-brand-50 group relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset dark:hover:bg-gray-800">
          <button type="button" className="relative flex-shrink-0 rounded-lg" onClick={() => handleCopy(item.token)}>
            {/* Enable OTP code masking */}
            <div className="absolute z-10 h-10 w-20 rounded-lg bg-white/30 backdrop-blur-none transition duration-150 ease-in-out group-hover:bg-transparent group-hover:backdrop-blur-none" />
            <div className="inline-flex h-10 w-20 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 transition duration-300 ease-in-out group-hover:scale-110">
              <span className="font-mono text-sm font-bold leading-none tracking-tighter text-white">{item.token}</span>
            </div>
          </button>

          <div className="flex w-full min-w-0 flex-1 justify-between">
            <div className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-xs font-bold text-gray-900 dark:text-gray-200">{item.issuer.toUpperCase()}</p>
              <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{item.user_identity}</p>
            </div>

            <div className="r-0 relative z-10 -mr-0.5 flex items-center justify-end">
              <EllipsisHorizontalCircleIcon
                className="h-6 w-6 cursor-pointer text-gray-500 hover:text-orange-600 dark:text-gray-300"
                onClick={() => setConfirmOpen(true)}
              />
            </div>
          </div>
        </div>
      </li>

      <FormUpdate open={confirmOpen} onClose={() => setConfirmOpen(false)} data={item} />
    </>
  )
}
