import React, { PropsWithChildren } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useSession } from './hooks/useSession';
import Layout from './components/Layout';
import PortalHome from './pages/PortalHome';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/Auth';
import Rent from './pages/Rent';
import Payments from './pages/Payments';
import Invoices from './pages/Invoices';
import ContractPage from './pages/Contract';
import Profile from './pages/Profile';
import Access from './pages/Access';

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { session, loading } = useSession();
  
  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: PropsWithChildren) => {
    const { session, loading } = useSession();
    if (!loading && session) return <Navigate to="/app/dashboard" replace />;
    return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PortalHome />} />
          <Route path="/login" element={<PublicRoute><AuthPage type="login" /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><AuthPage type="register" /></PublicRoute>} />

          {/* App Routes */}
          <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="access" element={<Access />} />
            <Route path="rent" element={<Rent />} />
            <Route path="payments" element={<Payments />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="contract" element={<ContractPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}