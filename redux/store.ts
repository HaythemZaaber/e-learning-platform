// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "@/redux/slices/search.slice";
import authReducer from "@/redux/slices/auth.slice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
