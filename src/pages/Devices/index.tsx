import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { ListCell, ListFullHeightCell } from '@/components/ListCell'
import PageTitle from '@/components/PageTitle'
import { DevicesResult } from '@/types'
import fetcher from '@/utils/fetcher'
import withProfile from '@/utils/with-profile'

import DeviceItem from './components/DeviceItem'

const ComponentBase = (): JSX.Element => {
  const { t } = useTranslation()
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(false)
  const { data: devices, isLoading } = useSWR<DevicesResult>(
    '/devices',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: isAutoRefresh ? 2000 : 0,
    },
  )
  const hasDevices = !!devices?.devices?.length

  const deviceList = hasDevices
    ? devices?.devices?.map((device) => (
        <ListCell key={device?.identifier}>
          <DeviceItem device={device} />
        </ListCell>
      ))
    : null

  return (
    <>
      <PageTitle
        title={t('home.device_management')}
        hasAutoRefresh={true}
        defaultAutoRefreshState={false}
        onAutoRefreshStateChange={(newState) => setIsAutoRefresh(newState)}
      />

      {!hasDevices && !isLoading ? (
        <ListFullHeightCell>{t('devices.empty_list')}</ListFullHeightCell>
      ) : isLoading ? (
        <ListFullHeightCell>
          {t('common.is_loading') + '...'}
        </ListFullHeightCell>
      ) : null}

      {hasDevices && !isLoading ? (
        <div className="divide-y">{deviceList}</div>
      ) : null}
    </>
  )
}

export const Component = withProfile(ComponentBase)

Component.displayName = 'DevicesPage'

export { ErrorBoundary } from '@/components/ErrorBoundary'
