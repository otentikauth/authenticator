import { FaceFrownIcon } from '@heroicons/react/24/outline'
import { ExitButton } from '../components/ExitButton'

export const ErrorScreen = ({ message }: { message: string }) => {
  return (
    <>
      <ExitButton />
      <div className="relative inset-0 z-10 mt-14 h-[544px] bg-gray-50 transition-opacity">
        <div className="flex h-full w-full items-center justify-center">
          <div>
            <FaceFrownIcon className="mx-auto h-14 w-14 text-gray-500" />
            <p className="my-6 text-center text-sm font-medium text-gray-700">{message || 'Something wrong :-('}</p>
          </div>
        </div>
      </div>
    </>
  )
}
