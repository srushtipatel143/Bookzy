"use client";
import OwnerNavbar from '../components/ownerNavbar/navbar';

export default function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <OwnerNavbar />
      <main className="flex-grow-1 d-flex">
        {children}
      </main>
    </div>
  );
}
