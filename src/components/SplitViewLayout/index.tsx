import React from 'react'
import { useLocation } from 'react-router'
import { useMediaQuery } from 'usehooks-ts'

import PageLayout from '@/components/PageLayout'
import { Component as HomePage } from '@/pages/Home'

import { SplitViewContext } from './context'

const SplitViewLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isXl = useMediaQuery('(min-width: 1280px)')
  const location = useLocation()

  const isLanding = location.pathname === '/'
  const isHome = location.pathname === '/home'
  const isSplitActive = isXl && !isLanding

  if (!isSplitActive) {
    return <PageLayout>{children}</PageLayout>
  }

  return (
    <SplitViewContext.Provider value={{ isSplitActive: true }}>
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
    </SplitViewContext.Provider>
  )
}

export default SplitViewLayout
