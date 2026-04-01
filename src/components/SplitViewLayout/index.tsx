import React, { useEffect } from 'react'
import { useLocation } from 'react-router'

import PageLayout from '@/components/PageLayout'
import { useSplitView } from '@/hooks/useSplitView'
import { Component as HomePage } from '@/pages/Home'

const SplitViewLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isSplitActive } = useSplitView()
  const location = useLocation()

  const isHome = location.pathname === '/home'

  useEffect(() => {
    if (!isSplitActive) return

    document.documentElement.style.overflow = 'hidden'
    document.documentElement.scrollTop = 0

    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [isSplitActive])

  if (!isSplitActive) {
    return <PageLayout>{children}</PageLayout>
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <div className="w-120 shrink-0 overflow-y-auto bg-background">
        <HomePage />
      </div>

      <div className="flex-1 min-w-0 overflow-y-auto @container">
        {isHome ? (
          <div className="h-full border-l border-gray-200 dark:border-gray-800 bg-background" />
        ) : (
          <PageLayout>{children}</PageLayout>
        )}
      </div>
    </div>
  )
}

export default SplitViewLayout
