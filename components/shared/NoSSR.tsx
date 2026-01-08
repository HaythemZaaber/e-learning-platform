"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";

export function NoSSR<T = {}>(Component: ComponentType<T>) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => null,
  });
}
