import React from 'react'

import { cn } from '@/utils/shadcn'

export const PolicyNameItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex-shrink-0 bg-muted dark:bg-background rounded-xl border px-2 py-2 overflow-hidden cursor-pointer shadow-sm font-bold hover:bg-gray-100 dark:hover:bg-black/90 transition-colors ease-in-out duration-200 text-xs select-none sm:px-3 sm:text-sm',
        className,
      )}
      {...props}
    />
  )
}
