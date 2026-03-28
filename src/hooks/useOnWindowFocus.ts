import { useEffect, useState } from 'react'

export const useOnWindowFocus = () => {
  const [isFocused, setIsFocused] = useState(() => document.hasFocus())

  useEffect(() => {
    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(false)

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return isFocused
}
