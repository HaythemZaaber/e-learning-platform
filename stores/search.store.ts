import { create } from 'zustand'

interface SearchState {
  showNavbarSearch: boolean
  setShowNavbarSearch: (show: boolean) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  showNavbarSearch: false,
  setShowNavbarSearch: (show) => set({ showNavbarSearch: show }),
})) 