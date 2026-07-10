import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentRole, requireAuthenticatedUser } from "@/lib/auth/roles";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuthenticatedUser();
  const role = await getCurrentRole();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar role={role} />
        <div className="min-w-0 flex-1">
          <Navbar role={role} />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
