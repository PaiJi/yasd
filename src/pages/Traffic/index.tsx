import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import bytes from 'bytes'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import { DataGroup, DataRow, DataRowMain } from '@/components/Data'
import HorizontalSafeArea from '@/components/HorizontalSafeArea'
import PageTitle from '@/components/PageTitle'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useConnectors, useInterfaces, useStartTime } from '@/store'
import { ConnectorTraffic } from '@/types'
import { cn } from '@/utils/shadcn'

dayjs.extend(relativeTime)

type TrafficRow = ConnectorTraffic & { name: string }

function SortableHeader({
  label,
  column,
  align = 'right',
}: {
  label: string
  column: {
    toggleSorting: (desc?: boolean) => void
    getIsSorted: () => false | 'asc' | 'desc'
  }
  align?: 'left' | 'right'
}) {
  const sorted = column.getIsSorted()
  return (
    <button
      className={cn(
        'cursor-pointer flex items-center gap-1',
        align === 'right' && 'ml-auto',
      )}
      onClick={() => column.toggleSorting()}
    >
      {label}
      {sorted === 'asc' ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />
      )}
    </button>
  )
}

function TrafficTable({
  title,
  data,
  columns,
}: {
  title?: string
  data: TrafficRow[]
  columns: ColumnDef<TrafficRow, unknown>[]
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'total', desc: true },
  ])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (data.length === 0) return null

  return (
    <div>
      {title && (
        <div className="text-gray-600 dark:text-white/90 text-sm leading-normal px-3 md:px-5 mb-1 lg:mb-2 lg:text-base lg:leading-relaxed">
          {title}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-muted">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'first:pl-3 first:md:pl-5 last:pr-3 last:md:pr-5',
                      header.column.columnDef.meta?.className,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      'first:pl-3 first:md:pl-5 last:pr-3 last:md:pr-5',
                      cell.column.columnDef.meta?.className,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export const Component: React.FC = () => {
  const { t } = useTranslation()
  const connectors = useConnectors()
  const interfaces = useInterfaces()
  const startTime = useStartTime()

  const columns = useMemo<ColumnDef<TrafficRow, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <SortableHeader
            label={t('requests.hostname')}
            column={column}
            align="left"
          />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
        meta: { className: 'min-w-[120px]' },
      },
      {
        accessorKey: 'out',
        header: ({ column }) => (
          <SortableHeader label={t('traffic.upload')} column={column} />
        ),
        cell: ({ row }) => bytes(row.original.out),
        meta: { className: 'tabular-nums text-right' },
      },
      {
        accessorKey: 'in',
        header: ({ column }) => (
          <SortableHeader label={t('traffic.download')} column={column} />
        ),
        cell: ({ row }) => bytes(row.original.in),
        meta: { className: 'tabular-nums text-right' },
      },
      {
        id: 'total',
        accessorFn: (row) => row.in + row.out,
        header: ({ column }) => (
          <SortableHeader label={t('traffic.total')} column={column} />
        ),
        cell: ({ row }) => bytes(row.original.in + row.original.out),
        meta: { className: 'tabular-nums text-right' },
      },
      {
        id: 'currentSpeed',
        accessorFn: (row) => row.inCurrentSpeed + row.outCurrentSpeed,
        header: ({ column }) => (
          <SortableHeader label={t('traffic.current_speed')} column={column} />
        ),
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <div>
              {'\u2191'} {bytes(row.original.outCurrentSpeed)}/s
            </div>
            <div>
              {'\u2193'} {bytes(row.original.inCurrentSpeed)}/s
            </div>
          </div>
        ),
        meta: {
          className: 'tabular-nums text-right w-[140px]',
        },
      },
      {
        id: 'maxSpeed',
        accessorFn: (row) => row.inMaxSpeed + row.outMaxSpeed,
        header: ({ column }) => (
          <SortableHeader label={t('traffic.maximum_speed')} column={column} />
        ),
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <div>
              {'\u2191'} {bytes(row.original.outMaxSpeed)}/s
            </div>
            <div>
              {'\u2193'} {bytes(row.original.inMaxSpeed)}/s
            </div>
          </div>
        ),
        meta: {
          className: 'tabular-nums text-right w-[140px]',
        },
      },
    ],
    [t],
  )

  const interfaceData = useMemo<TrafficRow[]>(
    () => Object.entries(interfaces).map(([name, data]) => ({ name, ...data })),
    [interfaces],
  )

  const connectorData = useMemo<TrafficRow[]>(
    () => Object.entries(connectors).map(([name, data]) => ({ name, ...data })),
    [connectors],
  )

  return (
    <>
      <PageTitle title={t('home.traffic')} />

      <HorizontalSafeArea>
        {startTime && (
          <div className="space-y-4 p-4 md:space-y-5 md:p-5">
            <DataGroup>
              <DataRow>
                <DataRowMain>
                  <div>{t('traffic.start_time')}</div>
                  <div>{dayjs(startTime).format('LLL')}</div>
                </DataRowMain>
              </DataRow>
              <DataRow>
                <DataRowMain>
                  <div>{t('traffic.uptime')}</div>
                  <div className="capitalize">
                    {dayjs(startTime).toNow(true)}
                  </div>
                </DataRowMain>
              </DataRow>
            </DataGroup>

            <TrafficTable
              title={t('traffic.interfaces')}
              data={interfaceData}
              columns={columns}
            />
            <TrafficTable
              title={t('home.traffic')}
              data={connectorData}
              columns={columns}
            />
          </div>
        )}
      </HorizontalSafeArea>
    </>
  )
}

Component.displayName = 'TrafficPage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
