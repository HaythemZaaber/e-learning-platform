import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthLayout } from "@/components/layout/auth/AuthLayout";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    // <AuthLayout>
    <LoginForm />
    // </AuthLayout>
  );
}
