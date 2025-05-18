import { ReactNode } from "react";

interface AuthFormContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthFormContainer({
  title,
  subtitle,
  children,
}: AuthFormContainerProps) {
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 text-white my-10">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm text-white/70">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
} 