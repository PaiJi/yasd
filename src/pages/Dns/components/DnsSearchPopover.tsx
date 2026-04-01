import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { SearchIcon } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/utils/shadcn'

const SearchSchema = z.object({
  search: z.string().optional(),
})

type SearchFormValues = z.infer<typeof SearchSchema>

type DnsSearchPopoverProps = {
  className?: string
  search: string
  onSearchChange: (value: string) => void
}

const DnsSearchPopover: React.FC<DnsSearchPopoverProps> = ({
  className,
  search,
  onSearchChange,
}) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const hasFilter = Boolean(search)

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      search: search || '',
    },
  })

  const onSubmit = useCallback(
    (data: SearchFormValues) => {
      setIsOpen(false)
      onSearchChange(data.search || '')
    },
    [onSearchChange],
  )

  const onHide = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <Popover open={isOpen}>
      <PopoverTrigger
        asChild
        onClick={() => {
          setIsOpen((val) => !val)
        }}
      >
        <Button
          className={cn(
            'space-x-2',
            hasFilter && 'bg-green-200 text-green-800 hover:bg-green-100',
            className,
          )}
          size="sm"
          variant="outline"
        >
          <SearchIcon className="h-4 w-4" />
          <span className="max-sm:hidden">{t('dns.search_domain')}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        onFocusOutside={onHide}
        onInteractOutside={onHide}
        onEscapeKeyDown={onHide}
        className="w-72"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dns.search_domain')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <ButtonGroup align="right">
              <Button
                size="sm"
                type="reset"
                autoFocus={false}
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  form.reset({ search: '' })
                  onSubmit({ search: '' })
                }}
              >
                {t('Clear')}
              </Button>
              <Button size="sm" type="submit">
                {t('Submit')}
              </Button>
            </ButtonGroup>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}

export default DnsSearchPopover
