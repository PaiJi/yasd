import React, { lazy, Suspense, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import bytes from 'bytes'

import { useInterfaces } from '@/store'
import { ConnectorTraffic } from '@/types'
import { cn } from '@/utils/shadcn'

const LineChart = lazy(() => import('./components/LineChart'))

const LineChartLoader = () => (
  <div className="flex items-center justify-center text-sm text-muted-foreground h-[200px]">
    Loading...
  </div>
)

const TrafficCell: React.FC = () => {
  const { t } = useTranslation()
  const interfaces = useInterfaces()

  const activeInterface = useMemo(() => {
    const aggregation: ConnectorTraffic = {
      outCurrentSpeed: 0,
      in: 0,
      inCurrentSpeed: 0,
      outMaxSpeed: 0,
      out: 0,
      inMaxSpeed: 0,
    }

    for (const name in interfaces) {
      const conn = interfaces[name]
      aggregation.in += conn.in
      aggregation.out += conn.out
      aggregation.outCurrentSpeed += conn.outCurrentSpeed
      aggregation.inCurrentSpeed += conn.inCurrentSpeed
    }

    return aggregation
  }, [interfaces])

  const betterSpeedString = (speed: number, isCircular: boolean = true) => {
    const readableString =
      bytes(speed, {
        unitSeparator: '---',
      }) ?? '0---B'
    const [value, unit] = readableString.split('---')

    return (
      <>
        {value}
        <span className="text-sm">{' ' + unit + (isCircular ? '/s' : '')}</span>
      </>
    )
  }

  return (
    <div className="mx-4 @3xl:mx-6 rounded-xl border bg-card overflow-hidden">
      <div className="p-2 pt-3 w-full overflow-hidden">
        <Suspense fallback={<LineChartLoader />}>
          <LineChart />
        </Suspense>
      </div>

      {activeInterface ? (
        <div className="grid grid-cols-3 bg-muted/50">
          <Cell>
            <Title>{t('traffic_cell.upload')}</Title>
            <Data className="truncate">
              {betterSpeedString(activeInterface.outCurrentSpeed)}
            </Data>
          </Cell>
          <Cell>
            <Title>{t('traffic_cell.download')}</Title>
            <Data className="truncate">
              {betterSpeedString(activeInterface.inCurrentSpeed)}
            </Data>
          </Cell>
          <Cell>
            <Title>{t('traffic_cell.total')}</Title>
            <Data className="truncate">
              {betterSpeedString(
                activeInterface.in + activeInterface.out,
                false,
              )}
            </Data>
          </Cell>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[67px] bg-muted/50 text-muted-foreground text-sm">
          {t('common.is_loading')}...
        </div>
      )}
    </div>
  )
}

export default TrafficCell

const Cell: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn('px-4 py-4 @3xl:px-5 @3xl:py-5', className)}
      {...props}
    />
  )
}

const Title: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'text-xs text-muted-foreground leading-relaxed uppercase tracking-wider font-medium',
        className,
      )}
      {...props}
    />
  )
}

const Data: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'text-md @3xl:text-2xl text-foreground font-bold leading-normal tabular-nums tracking-tight',
        className,
      )}
      {...props}
    />
  )
}
