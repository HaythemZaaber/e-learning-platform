import { LoginForm } from "@/components/pages/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600"></div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
      
      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#ff0080,#7928ca,#ff0080)] animate-spin-slow"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
              <p className="mt-2 text-sm text-white/70">Sign in to continue your journey</p>
            </div> */}
            <LoginForm />
          {/* </div>
        </div> */}
      </div>
    </div>
  );
}
