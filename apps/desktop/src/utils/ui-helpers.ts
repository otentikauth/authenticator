// Get initial from full name for avatar.
export const getInitials = (fullName: string): string => {
  const nameArr = fullName.split('')
  const initials = nameArr.filter(function (char) {
    return /[A-Z]/.test(char)
  })
  return initials.join('')
}

// Disable browser back button.
export const disableBrowserEvents = (eventName: string) => {
  return document.addEventListener(
    eventName,
    (e) => {
      e.preventDefault()
      return false
    },
    { capture: true }
  )
}

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
