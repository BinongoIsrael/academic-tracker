import AuthenticatedHeader from "./components/AuthenticatedHeader";
import Sidebar from "./components/Sidebar";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-surface">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 relative">
          <AuthenticatedHeader />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </GlobalErrorBoundary>
  );
}
