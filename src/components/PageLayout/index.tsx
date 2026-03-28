import React from 'react'

import FixedFullscreenContainer from '@/components/FixedFullscreenContainer'
import PageContainer from '@/components/PageContainer'
import { useSplitView } from '@/components/SplitViewLayout/context'
import { useRouteOptions } from '@/router'
import { cn } from '@/utils/shadcn'

const PageLayout: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  const routeOptions = useRouteOptions()
  const { isSplitActive } = useSplitView()
  const isFullscreen = routeOptions?.fullscreen ?? false
  const isBottomSafeAreaShown = routeOptions?.bottomSafeArea ?? true

  return (
    <div
      className={cn(
        'w-full flex-1 flex min-h-full overflow-x-clip',
        !isSplitActive && 'justify-center',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex flex-1 relative w-full bg-background',
          !isSplitActive && 'max-w-4xl',
        )}
      >
        <div className="relative w-full border-l border-r border-gray-200 dark:border-gray-800">
          {isFullscreen ? (
            <FixedFullscreenContainer offsetBottom={isBottomSafeAreaShown}>
              {children}
            </FixedFullscreenContainer>
          ) : (
            <PageContainer>{children}</PageContainer>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageLayout
