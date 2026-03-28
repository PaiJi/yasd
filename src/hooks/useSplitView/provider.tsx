import React from 'react'
import { useLocation } from 'react-router'
import { useMediaQuery } from 'usehooks-ts'

import { SplitViewContext } from './context'

export const SplitViewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isXl = useMediaQuery('(min-width: 1280px)')
  const location = useLocation()

  const isLanding = location.pathname === '/'
  const isSplitActive = isXl && !isLanding

  return (
    <SplitViewContext.Provider value={{ isSplitActive }}>
      {children}
    </SplitViewContext.Provider>
  )
}
