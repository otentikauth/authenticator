import { BoltSlashIcon } from '@heroicons/react/24/outline'

export const OfflineScreen = () => {
  return (
    <div className="relative inset-0 z-10 mt-14 h-[544px] bg-gray-50 transition-opacity">
      <div className="flex h-full w-full items-center justify-center">
        <div>
          <BoltSlashIcon className="mx-auto h-14 w-14 text-gray-500" />
          <h3 className="my-6 text-sm font-medium text-gray-700">You are not connected to internet!</h3>
        </div>
      </div>
    </div>
  )
}
