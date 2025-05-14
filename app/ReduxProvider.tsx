// app/ReduxProvider.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { Toaster } from "sonner";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-center" richColors />
    </Provider>
  );
}
