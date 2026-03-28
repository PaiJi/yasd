import React, { memo } from 'react'
import { css } from '@emotion/react'
import { useMediaQuery } from 'usehooks-ts'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { cn } from '@/utils/shadcn'

const CustomDrawerContent = memo(function CustomDrawerContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerContent>) {
  return <DrawerContent className={cn('px-6', className)} {...props} />
})

const CustomDrawerHeader = memo(function CustomDrawerHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerHeader>) {
  return <DrawerHeader className={cn('px-0', className)} {...props} />
})

const CustomDrawerFooter = memo(function CustomDrawerFooter({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerFooter>) {
  return (
    <DrawerFooter
      {...props}
      className="px-0"
      css={css`
        padding-bottom: max(env(safe-area-inset-bottom), 1rem);
      `}
    >
      {children}
    </DrawerFooter>
  )
})

export const useResponsiveDialog = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop
    ? ({
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
      } as const)
    : ({
        Dialog: Drawer,
        DialogClose: DrawerClose,
        DialogContent: CustomDrawerContent,
        DialogDescription: DrawerDescription,
        DialogFooter: CustomDrawerFooter,
        DialogHeader: CustomDrawerHeader,
        DialogTitle: DrawerTitle,
        DialogTrigger: DrawerTrigger,
      } as const)
}
