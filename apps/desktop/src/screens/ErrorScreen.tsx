import { ShieldExclamationIcon } from '@heroicons/react/24/outline'

export const ErrorScreen = ({ message }: { message: string }) => {
  return (
    <div className="relative inset-0 z-10 mt-14 h-[544px] bg-gray-50 transition-opacity">
      <div className="flex h-full w-full items-center justify-center">
        <div>
          <ShieldExclamationIcon className="mx-auto h-14 w-14 text-gray-500" />
          <p className="my-6 text-center text-sm font-medium text-gray-700">{message}</p>
        </div>
      </div>
    </div>
  )
}
