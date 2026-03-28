import { createContext, useContext } from 'react'

interface SplitViewState {
  isSplitActive: boolean
}

export const SplitViewContext = createContext<SplitViewState>({
  isSplitActive: false,
})

export const useSplitView = () => useContext(SplitViewContext)
