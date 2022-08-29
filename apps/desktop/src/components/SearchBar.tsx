import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useHotkeys } from 'react-hotkeys-hook'
import { FC, useRef } from 'react'

interface ISearchBar {
  keyword: string
  setKeyword: (str: string) => void
}

export const SearchBar: FC<ISearchBar> = ({ keyword, setKeyword }) => {
  const searchInputRef = useRef<HTMLInputElement>(null)
  useHotkeys('ctrl+f, command+f', () => searchInputRef.current?.focus())

  return (
    <div className="fixed left-0 right-0 z-10 mx-auto -mt-1 flex max-w-sm justify-between bg-gray-900 px-4 pb-5">
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="search"
          name="search"
          ref={searchInputRef}
          className="block w-full rounded-md border border-transparent bg-gray-800 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-gray-700 focus:bg-gray-700 focus:text-gray-100 focus:outline-none focus:ring-gray-700"
          onChange={(e) => setKeyword(e.target.value)}
          defaultValue={keyword}
          placeholder="Search item"
          type="search"
        />
      </div>
    </div>
  )
}
