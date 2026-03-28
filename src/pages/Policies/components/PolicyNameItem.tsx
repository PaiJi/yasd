import React from 'react'

import { cn } from '@/utils/shadcn'

export const PolicyNameItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-muted dark:bg-background rounded-xl border px-2 py-1.5 cursor-pointer font-bold hover:bg-gray-100 dark:hover:bg-black/90 transition-colors ease-in-out duration-200 text-xs select-none sm:px-3 sm:py-2 sm:text-sm ring-1 ring-black/[0.03] dark:ring-white/[0.04]',
        className,
      )}
      {...props}
    />
  )
}
