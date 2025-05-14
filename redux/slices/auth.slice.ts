// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserRole = "visitor" | "student" | "teacher" | "parent";

interface AuthState {
  role: UserRole;
}

const initialState: AuthState = {
  role: "visitor",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    switchRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
  },
});

export const { switchRole } = authSlice.actions;
export default authSlice.reducer;
