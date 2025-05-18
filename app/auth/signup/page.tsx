import { SignupForm } from "@/features/auth/components/SignupForm";
import { AuthLayout } from "@/features/auth/components/AuthLayout";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
