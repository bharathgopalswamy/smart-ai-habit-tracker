import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 overflow-hidden">{children}</main>
    </div>
  );
}