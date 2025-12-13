import Navbar from "@/components/Navbar";
import Sidebar from "./components/Sidebar";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Sidebar />
        {children}
    </>
  );
}
