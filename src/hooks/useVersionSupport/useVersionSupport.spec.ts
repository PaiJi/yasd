import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { usePlatform, usePlatformVersion } from '@/store'

import { useVersionSupport } from './useVersionSupport'

vi.mock('@/store', () => ({
  usePlatform: vi.fn(),
  usePlatformVersion: vi.fn(),
}))

describe('useVersionSupport', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe.each`
    platform   | platformVersion | macos        | ios          | tvos         | expected
    ${'macos'} | ${'10.15.0'}    | ${'10.14.0'} | ${undefined} | ${undefined} | ${true}
    ${'macos'} | ${'10.15.0'}    | ${'10.16.0'} | ${undefined} | ${undefined} | ${false}
    ${'ios'}   | ${'10.15.0'}    | ${'10.14.0'} | ${undefined} | ${undefined} | ${false}
    ${'ios'}   | ${'10.15.0'}    | ${undefined} | ${true}      | ${undefined} | ${true}
    ${'ios'}   | ${'10.15.0'}    | ${true}      | ${true}      | ${true}      | ${true}
  `(
    'when platform is $platform and platformVersion is $platformVersion and macos is $macos and ios is $ios and tvos is $tvos',
    ({ platform, platformVersion, macos, ios, tvos, expected }: any) => {
      beforeEach(() => {
        vi.mocked(usePlatform).mockReturnValue(platform)
        vi.mocked(usePlatformVersion).mockReturnValue(platformVersion)
      })

      it('should work', () => {
        const { result } = renderHook(() =>
          useVersionSupport({ macos, ios, tvos }),
        )

        expect(result.current).toBe(expected)
      })
    },
  )
})
