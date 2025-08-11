// @/stores/useCoursePreviewStore.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Course, CourseLecture, CourseProgress } from '@/types/courseTypes';

interface CoursePreviewState {
  // Current course data
  currentCourse: Course | null;
  currentLecture: CourseLecture | null;
  courseProgress: CourseProgress | null;
  
  // UI state
  activeSection: string;
  expandedSections: Set<string>;
  videoProgress: number;
  isVideoPlaying: boolean;
  playbackSpeed: number;
  volume: number;
  
  // Cart state
  cartItems: Set<string>;
  wishlistItems: Set<string>;
  
  // Loading states
  isLoadingCourse: boolean;
  isLoadingLecture: boolean;
  isProcessingEnrollment: boolean;
  
  // Error states
  courseError: string | null;
  lectureError: string | null;
  
  // Store version for forcing re-renders
  storeVersion: number;
  
  // Actions
  setCourse: (course: Course | null) => void;
  setLecture: (lecture: CourseLecture | null) => void;
  setProgress: (progress: CourseProgress | null) => void;
  setActiveSection: (section: string) => void;
  toggleSection: (sectionId: string) => void;
  setVideoProgress: (progress: number) => void;
  setIsVideoPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  addToCart: (courseId: string) => void;
  removeFromCart: (courseId: string) => void;
  addToWishlist: (courseId: string) => void;
  removeFromWishlist: (courseId: string) => void;
  setLoadingStates: (states: Partial<{
    isLoadingCourse: boolean;
    isLoadingLecture: boolean;
    isProcessingEnrollment: boolean;
  }>) => void;
  setErrors: (errors: Partial<{
    courseError: string | null;
    lectureError: string | null;
  }>) => void;
  resetStore: () => void;
  updateLectureCompletion: (lectureId: string, isCompleted: boolean) => void;
  updateLectureDuration: (lectureId: string, duration: number) => void;
  incrementStoreVersion: () => void;
}

const initialState = {
  currentCourse: null,
  currentLecture: null,
  courseProgress: null,
  activeSection: 'overview',
  expandedSections: new Set<string>(),
  videoProgress: 0,
  isVideoPlaying: false,
  playbackSpeed: 1,
  volume: 1,
  cartItems: new Set<string>(),
  wishlistItems: new Set<string>(),
  isLoadingCourse: false,
  isLoadingLecture: false,
  isProcessingEnrollment: false,
  courseError: null,
  lectureError: null,
  storeVersion: 0,
};

export const useCoursePreviewStore = create<CoursePreviewState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setCourse: (course) => set((state) => ({ 
          currentCourse: course,
          storeVersion: state.storeVersion + 1 // Force re-render
        })),
        setLecture: (lecture) => set({ currentLecture: lecture }),
        setProgress: (progress) => set((state) => ({ 
          courseProgress: progress,
          storeVersion: state.storeVersion + 1 // Force re-render
        })),
        setActiveSection: (section) => set({ activeSection: section }),
        
        toggleSection: (sectionId) => set((state) => {
          const newExpanded = new Set(state.expandedSections);
          if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
          } else {
            newExpanded.add(sectionId);
          }
          return { expandedSections: newExpanded };
        }),
        
        setVideoProgress: (progress) => set({ videoProgress: progress }),
        setIsVideoPlaying: (playing) => set({ isVideoPlaying: playing }),
        setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
        setVolume: (volume) => set({ volume: volume }),
        
        addToCart: (courseId) => set((state) => {
          const newCart = new Set(state.cartItems);
          newCart.add(courseId);
          return { cartItems: newCart };
        }),
        
        removeFromCart: (courseId) => set((state) => {
          const newCart = new Set(state.cartItems);
          newCart.delete(courseId);
          return { cartItems: newCart };
        }),
        
        addToWishlist: (courseId) => set((state) => {
          const newWishlist = new Set(state.wishlistItems);
          newWishlist.add(courseId);
          return { wishlistItems: newWishlist };
        }),
        
        removeFromWishlist: (courseId) => set((state) => {
          const newWishlist = new Set(state.wishlistItems);
          newWishlist.delete(courseId);
          return { wishlistItems: newWishlist };
        }),
        
        setLoadingStates: (states) => set(states),
        setErrors: (errors) => set(errors),
        
        resetStore: () => set(initialState),
        
        updateLectureCompletion: (lectureId: string, isCompleted: boolean) => set((state) => {
          if (!state.currentCourse) return state;
          
          const updatedCourse = {
            ...state.currentCourse,
            sections: state.currentCourse.sections.map((section: any) => ({
              ...section,
              lectures: section.lectures?.map((lecture: any) => 
                lecture.id === lectureId 
                  ? { ...lecture, isCompleted }
                  : lecture
              ) || []
            }))
          };
          
          return { 
            currentCourse: updatedCourse,
            storeVersion: state.storeVersion + 1 // Force re-render
          };
        }),

        updateLectureDuration: (lectureId: string, duration: number) => set((state) => {
          if (!state.currentCourse) return state;
          
          const updatedCourse = {
            ...state.currentCourse,
            sections: state.currentCourse.sections.map((section: any) => ({
              ...section,
              lectures: section.lectures?.map((lecture: any) => 
                lecture.id === lectureId 
                  ? { ...lecture, duration }
                  : lecture
              ) || []
            }))
          };
          
          return { 
            currentCourse: updatedCourse,
            storeVersion: state.storeVersion + 1 // Force re-render
          };
        }),

        incrementStoreVersion: () => set((state) => ({ storeVersion: state.storeVersion + 1 })),
      }),
      {
        name: 'course-preview-storage',
        partialize: (state) => ({
          cartItems: Array.from(state.cartItems),
          wishlistItems: Array.from(state.wishlistItems),
          playbackSpeed: state.playbackSpeed,
          volume: state.volume,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Convert arrays back to Sets after rehydration
            state.cartItems = new Set(state.cartItems as any);
            state.wishlistItems = new Set(state.wishlistItems as any);
          }
        },
      }
    )
  )
);