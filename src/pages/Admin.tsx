
import { useState } from 'react';
import { useCorreioStore } from '@/hooks/useCorreioStore';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

const Admin = () => {
  const { isAuthenticated } = useCorreioStore();
  const [showDashboard, setShowDashboard] = useState(isAuthenticated);

  const handleLogin = () => {
    setShowDashboard(true);
  };

  if (showDashboard && isAuthenticated) {
    return <AdminDashboard />;
  }

  return <AdminLogin onLogin={handleLogin} />;
};

export default Admin;
