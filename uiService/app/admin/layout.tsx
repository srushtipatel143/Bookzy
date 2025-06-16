"use client";
import AdminNavbar from '../components/adminNavbar/navbar';

export default function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <AdminNavbar />
      <main className="flex-grow-1 d-flex">
        {children}
      </main>
    </div>
  );
}
