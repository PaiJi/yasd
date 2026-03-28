import React from 'react'
import { css, type Interpolation, type Theme } from '@emotion/react'

import { isTruthy } from '@/utils'
import { cn } from '@/utils/shadcn'

type MethodBadgeProps = {
  failed: 1 | 0 | boolean
  method: string
  status: string
  css?: Interpolation<Theme>
} & React.HTMLAttributes<HTMLDivElement>

const MethodBadge: React.FC<MethodBadgeProps> = ({
  failed,
  method,
  status,
  className,
  css: cssProp,
  ...args
}) => {
  return (
    <div
      className={cn(
        'rounded px-1 text-white inline-block',
        isTruthy(failed)
          ? 'bg-red-500'
          : status === 'Active'
            ? 'bg-green-500'
            : 'bg-blue-500',
        className,
      )}
      css={[
        css`
          height: 1rem;
          line-height: 1rem;
          font-size: 0.5rem;
        `,
        cssProp,
      ]}
      {...args}
    >
      {method.toUpperCase()}
    </div>
  )
}

export default MethodBadge
