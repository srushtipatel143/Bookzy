import Navbar from '../components/navbar/navbar';

export default function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="flex-grow-1 d-flex">
        {children}
      </main>
    </div>
  );
}
