"use client";
import Navbar from '../components/navbar/navbar';
import { useSearch } from "../components/context/searchContext";
import Searchfield from "../components/navbar/search";

export default function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { showSearch } = useSearch();
  return (
    !showSearch ? (
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Navbar />
        <main className="flex-grow-1 d-flex">
          {children}
        </main>
      </div>
    ) : (
      <Searchfield />
    )
  );
}
