import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  InstructorProfile, 
  InstructorStats, 
  UpdateInstructorProfileInput,
  InstructorSearchFilters,
  InstructorSearchResponse 
} from '@/types/instructorTypes';

interface InstructorProfileState {
  // Profile data
  profile: InstructorProfile | null;
  stats: InstructorStats | null;
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  isUpdating: boolean;
  
  // UI states
  isEditMode: boolean;
  isPreviewMode: boolean;
  
  // Search results
  searchResults: InstructorSearchResponse | null;
  isSearching: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  setProfile: (profile: InstructorProfile | null) => void;
  setStats: (stats: InstructorStats | null) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setEditMode: (editMode: boolean) => void;
  setPreviewMode: (previewMode: boolean) => void;
  setSearchResults: (results: InstructorSearchResponse | null) => void;
  setSearching: (searching: boolean) => void;
  setError: (error: string | null) => void;
  
  // Profile actions
  updateProfile: (updates: Partial<InstructorProfile>) => void;
  resetProfile: () => void;
  
  // Search actions
  setSearchFilters: (filters: InstructorSearchFilters) => void;
  clearSearchResults: () => void;
  
  // Utility actions
  clearError: () => void;
  resetState: () => void;
}

const initialState = {
  profile: null,
  stats: null,
  isLoading: false,
  isSaving: false,
  isUpdating: false,
  isEditMode: false,
  isPreviewMode: false,
  searchResults: null,
  isSearching: false,
  error: null,
};

export const useInstructorProfileStore = create<InstructorProfileState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Setters
        setProfile: (profile) => set({ profile }),
        setStats: (stats) => set({ stats }),
        setLoading: (isLoading) => set({ isLoading }),
        setSaving: (isSaving) => set({ isSaving }),
        setUpdating: (isUpdating) => set({ isUpdating }),
        setEditMode: (isEditMode) => set({ isEditMode }),
        setPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
        setSearchResults: (searchResults) => set({ searchResults }),
        setSearching: (isSearching) => set({ isSearching }),
        setError: (error) => set({ error }),
        
        // Profile actions
        updateProfile: (updates) => {
          const { profile } = get();
          if (profile) {
            set({ 
              profile: { ...profile, ...updates },
              isUpdating: false 
            });
          }
        },
        
        resetProfile: () => set({ 
          profile: null, 
          stats: null,
          isEditMode: false,
          isPreviewMode: false 
        }),
        
        // Search actions
        setSearchFilters: (filters) => {
          // This will be used by the search service
          set({ isSearching: true });
        },
        
        clearSearchResults: () => set({ 
          searchResults: null, 
          isSearching: false 
        }),
        
        // Utility actions
        clearError: () => set({ error: null }),
        
        resetState: () => set(initialState),
      }),
      {
        name: 'instructor-profile-store',
        partialize: (state) => ({
          profile: state.profile,
          stats: state.stats,
          isEditMode: state.isEditMode,
          isPreviewMode: state.isPreviewMode,
        }),
      }
    ),
    {
      name: 'instructor-profile-store',
    }
  )
);

// Selectors for better performance
export const useInstructorProfile = () => useInstructorProfileStore((state) => state.profile);
export const useInstructorStats = () => useInstructorProfileStore((state) => state.stats);
export const useInstructorLoading = () => useInstructorProfileStore((state) => state.isLoading);
export const useInstructorSaving = () => useInstructorProfileStore((state) => state.isSaving);
export const useInstructorEditMode = () => useInstructorProfileStore((state) => state.isEditMode);
export const useInstructorPreviewMode = () => useInstructorProfileStore((state) => state.isPreviewMode);
export const useInstructorError = () => useInstructorProfileStore((state) => state.error);
export const useInstructorSearchResults = () => useInstructorProfileStore((state) => state.searchResults);
export const useInstructorSearching = () => useInstructorProfileStore((state) => state.isSearching);
