export const LoaderScreen = () => {
  return (
    <div className="fixed inset-0 z-20 bg-gray-900 backdrop-blur-sm transition-opacity">
      <div className="flex h-full w-full max-w-sm items-center justify-center">
        <div className="loader h-8 w-2 opacity-50 before:h-8 before:w-2 after:h-8 after:w-2">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  )
}
