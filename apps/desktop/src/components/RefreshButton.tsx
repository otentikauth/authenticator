import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useStores } from '../stores/stores'

export const RefreshButton = () => {
  const setForceFetch = useStores((state) => state.setForceFetch)

  return (
    <div className="absolute top-0 right-0 z-10 flex h-14 items-center px-4">
      <div className="relative">
        <div>
          <button
            className="-mr-1 flex cursor-pointer items-center justify-center rounded-md p-1.5 outline-none hover:bg-gray-700"
            onClick={() => setForceFetch(true)}
          >
            <ArrowPathIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
