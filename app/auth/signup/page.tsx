import { SignupForm } from "@/features/auth/components/SignupForm";
import { AuthLayout } from "@/components/layout/auth/AuthLayout";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    // <AuthLayout>
    <SignupForm />
    //</AuthLayout>
  );
}
