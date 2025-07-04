import NavbarBrand from "@/components/layout/navbar/NavbarBrand";
import { AuthLayout } from "@/components/layout/auth/AuthLayout";
import type { Metadata } from "next";
import AuthNavbarBrand from "@/components/layout/auth/AuthNavbarBrand";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased duration-300`}>
        <AuthNavbarBrand />
        <AuthLayout>
          <main>{children}</main>
        </AuthLayout>
        {/* Footer would go here */}
      </body>
    </html>
  );
}
