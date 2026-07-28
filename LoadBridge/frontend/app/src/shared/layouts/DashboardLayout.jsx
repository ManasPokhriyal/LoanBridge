import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <Navbar />
      <main>
        <div className="page-shell py-7 sm:py-9">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
