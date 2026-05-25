"use client";

import { useState, useEffect } from "react";
import AuthenticatedHeader from "./components/AuthenticatedHeader";
import Sidebar from "./components/Sidebar";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-screen overflow-hidden bg-surface animate-pulse">
        <div className="hidden md:block w-64 bg-surface-container-low border-r border-border shrink-0" />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-16 border-b border-border" />
          <div className="flex-1" />
        </div>
      </div>
    );
  }

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
