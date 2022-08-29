import { FC } from 'react'

import { EmptyState } from './EmptyState'
import { ItemSingle } from './ItemSingle'

interface ItemProps {
  data: any
}

export const ItemsList: FC<ItemProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <EmptyState />
  }

  return (
    <>
      <ul className="relative z-0 divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item: any) => (
          <ItemSingle key={item.id} item={item} />
        ))}
      </ul>

      {/* {Object.keys(data).map((letter) => (
        <div key={letter} className="relative">
          <div className="sticky top-0 border-t border-b border-gray-200 bg-gray-100 px-6 py-1 text-sm font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800">
            <h3>{letter}</h3>
          </div>
          <ul className="relative z-0 divide-y divide-gray-200 dark:divide-gray-700">
            {data[letter].map((item: any) => (
              <ItemSingle key={item.id} item={item} />
            ))}
          </ul>
        </div>
      ))} */}
    </>
  )
}
