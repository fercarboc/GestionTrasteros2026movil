import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import { Home, Key, CreditCard, FileText, User, LogOut, ScanLine } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col md:flex-row items-center justify-center md:justify-start md:px-4 md:py-3 md:space-x-3 rounded-lg transition-colors ${
        isActive
          ? 'text-primary-600 md:bg-primary-50'
          : 'text-gray-500 hover:text-gray-900 md:hover:bg-gray-100'
      }`
    }
  >
    <Icon className="w-6 h-6 md:w-5 md:h-5 mb-1 md:mb-0" />
    <span className="text-[10px] md:text-sm font-medium">{label}</span>
  </NavLink>
);

export default function Layout() {
  const { signOut, user } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/app/dashboard': return 'Mi Trastero';
      case '/app/rent': return 'Alquilar';
      case '/app/payments': return 'Pagos';
      case '/app/invoices': return 'Facturas';
      case '/app/contract': return 'Contrato';
      case '/app/profile': return 'Perfil';
      case '/app/access': return 'Acceso Trastero';
      default: return 'Portal';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary-600">Trasteros</h1>
          <p className="text-xs text-gray-500 mt-1">Portal Cliente</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem to="/app/dashboard" icon={Home} label="Inicio" />
          <NavItem to="/app/access" icon={ScanLine} label="Acceso" />
          <NavItem to="/app/rent" icon={Key} label="Alquilar" />
          <NavItem to="/app/payments" icon={CreditCard} label="Pagos" />
          <NavItem to="/app/invoices" icon={FileText} label="Facturas" />
          <NavItem to="/app/contract" icon={FileText} label="Contrato" />
          <NavItem to="/app/profile" icon={User} label="Perfil" />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile & Content Area */}
      <main className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
          <div className="text-xs text-gray-500 truncate max-w-[120px]">
            {user?.email}
          </div>
        </header>

        {/* Desktop Header Info */}
        <header className="hidden md:flex bg-white border-b border-gray-200 px-8 py-4 justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">{getPageTitle()}</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Hola, {user?.email}</p>
            </div>
            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <Outlet />
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 pb-safe">
          <div className="flex justify-around items-end pb-1 pt-2">
            <NavItem to="/app/dashboard" icon={Home} label="Inicio" />
            <NavItem to="/app/access" icon={ScanLine} label="Acceso" />
            <NavItem to="/app/rent" icon={Key} label="Alquilar" />
            <NavItem to="/app/payments" icon={CreditCard} label="Pagos" />
            <NavItem to="/app/profile" icon={User} label="Perfil" />
          </div>
        </nav>
      </main>
    </div>
  );
}