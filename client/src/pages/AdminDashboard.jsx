import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import SuperAdminDashboard from '../components/dashboard/SuperAdminDashboard';
import StaffDashboard from '../components/dashboard/StaffDashboard';
import KepalaLpkDashboard from '../components/dashboard/KepalaLpkDashboard';
import {
  clearAuthSession,
  getLoginPath,
  getTokenPayload,
} from '../utils/adminAuth';

const AdminDashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = window.location.pathname;
    const payload = getTokenPayload(pathname);
    if (!payload) {
        navigate(getLoginPath(pathname));
        return;
    }

    try {
        setUserRole(payload.role);
    } catch (e) {
        console.error('Failed to parse token', e);
        clearAuthSession(pathname);
        navigate(getLoginPath(pathname));
    } finally {
        setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const renderDashboard = () => {
    if (!userRole) return <div className="p-10 text-center">Memuat dashboard...</div>;
    
    const role = String(userRole).toUpperCase();
    
    switch (role) {
      case 'STAFF':
        return <StaffDashboard />;
      case 'KEPALA_LPK':
        return <KepalaLpkDashboard />;
      case 'SUPER_ADMIN':
      case 'SUPERADMIN':
        return <SuperAdminDashboard />;
      default:
        return <div className="p-10 text-center text-red-500 font-bold">Role tidak dikenali: {userRole}</div>;
    }
  };

  return (
    <AdminLayout>
      {renderDashboard()}
    </AdminLayout>
  );
};

export default AdminDashboard;
