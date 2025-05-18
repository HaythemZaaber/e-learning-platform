import { create } from 'zustand'

type UserRole = "visitor" | "student" | "teacher" | "parent"

interface AuthState {
  role: UserRole
  switchRole: (role: UserRole) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  role: "visitor",
  switchRole: (role: UserRole) => set({ role }),
})) 