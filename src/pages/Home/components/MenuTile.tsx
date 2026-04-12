import React from 'react'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/utils/shadcn'

interface MenuTileProps {
  title: string
  description?: string
  onClick?: () => void
  link?: string
  switchElement?: React.ReactNode
}

const MenuTile: React.FC<MenuTileProps> = (props) => {
  const isClickable = !!props.onClick

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? props.onClick : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                props.onClick?.()
              }
            }
          : undefined
      }
      className={cn(
        'rounded-xl border border-border/70 bg-card text-card-foreground',
        'h-full flex flex-col overflow-hidden',
        'transition-colors duration-150',
        isClickable && [
          'cursor-pointer',
          'hover:bg-accent/50 dark:hover:bg-white/4',
          'active:bg-accent/80 dark:active:bg-white/7',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        ],
      )}
    >
      {/* Content zone */}
      <div className="flex-1 px-4 py-3.5 @md:px-5 @md:py-4">
        {/* Title row */}
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-medium text-sm @md:text-[0.9375rem] truncate leading-snug">
            {props.title}
          </h4>

          {isClickable && (
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />
          )}
        </div>

        {/* Description */}
        {props.description && (
          <p className="mt-2 text-xs sm:text-[0.8125rem] text-muted-foreground leading-relaxed line-clamp-3">
            {props.description}
          </p>
        )}
      </div>

      {/* Toggle zone — separated by thin rule, pinned to bottom */}
      {props.switchElement && (
        <div
          className="bg-muted flex items-center justify-end px-4 py-2.5 @md:px-5 border-t border-border/50"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {props.switchElement}
        </div>
      )}
    </div>
  )
}

export default MenuTile
