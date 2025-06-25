import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn(" sm:w-[90vw] mx-auto px-4 sm:px-0", className)}>{children}</div>
  );
}
