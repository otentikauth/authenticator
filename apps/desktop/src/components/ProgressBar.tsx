import { FC } from 'react'
import { classNames } from '../utils/ui-helpers'

type ProgressBarProps = {
  percentage: number
}

export const ProgressBar: FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="absolute left-0 right-0 top-28 z-10 mt-0.5 w-full">
      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700">
        <div
          style={{ width: `${percentage}%` }}
          className={classNames(
            percentage >= 60 ? 'from-blue-500 to-red-500' : 'from-cyan-500 to-blue-500',
            'h-1.5 bg-gradient-to-r'
          )}
        ></div>
      </div>
    </div>
  )
}
