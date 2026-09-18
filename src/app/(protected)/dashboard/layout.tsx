import { DashboardHeader } from "./_components/DashboardHeader";
import DashboardNav from "./_components/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      <DashboardHeader />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <DashboardNav />

        <main className="min-w-0 flex-1 p-6">
          <div className="mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
