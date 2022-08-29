import { AppLogo } from './AppLogo'

export const TitleBar = () => {
  return (
    <div
      data-tauri-drag-region
      className="fixed top-0 left-0 right-0 z-10 mx-auto flex h-14 max-w-sm items-center justify-between bg-gray-900 py-3 px-4"
    >
      <div className="inline-flex items-center">
        <AppLogo className="mr-1.5 h-6 w-auto" />
      </div>
    </div>
  )
}
