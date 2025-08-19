// stores/auth-store.ts
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Types
export enum UserRole {
  ADMIN = "ADMIN",
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
}
export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isHydrated: boolean; // Track if the store has been hydrated from storage
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setUserRole: (role: UserRole) => void; // Add function to set user role
  clearAuth: () => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

// Helper functions
const getInitials = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return "U";
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

const getFullName = (firstName?: string, lastName?: string): string => {
  return [firstName, lastName].filter(Boolean).join(" ") || "User";
};

// Zustand Store
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        user: null,
        isLoading: true, // Start with loading true
        isAuthenticated: false,
        error: null,
        isHydrated: false, // Track hydration state

        // Actions
        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
            state.error = null;
            state.isLoading = false; // Set loading to false when user is set
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
            state.isLoading = false;
          }),

        updateUser: (updates) =>
          set((state) => {
            if (state.user) {
              Object.assign(state.user, updates);
            }
          }),

        setUserRole: (role) =>
          set((state) => {
            if (state.user) {
              state.user.role = role;
            }
          }),

        clearAuth: () =>
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
          }),

        logout: () => {
          const { clearAuth } = get();
          clearAuth();
          // Additional logout logic can be added here
        },

        setHydrated: (hydrated) =>
          set((state) => {
            state.isHydrated = hydrated;
            // If we're hydrated and have no user, set loading to false
            if (hydrated && !state.user) {
              state.isLoading = false;
            }
          }),
      })),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          // When rehydration is complete, mark as hydrated
          if (state) {
            state.setHydrated(true);
          }
        },
      }
    ),
    { name: "auth-store" }
  )
);

// Computed selectors
export const useAuthSelectors = () => {
  const { user } = useAuthStore();

  return {
    userInitials: getInitials(user?.firstName, user?.lastName),
    userFullName: getFullName(user?.firstName, user?.lastName),
    userRole: user?.role,
    isAdmin: user?.role === UserRole.ADMIN,
    isInstructor: user?.role === UserRole.INSTRUCTOR,
    isStudent: user?.role === UserRole.STUDENT,
    isParent: user?.role === UserRole.PARENT,
  };
};
