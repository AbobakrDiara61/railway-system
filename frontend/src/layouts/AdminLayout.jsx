import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { AdminTopBar } from '../components/layout/AdminTopBar';
import { useUIStore } from '../store/uiStore';
import { motion } from 'framer-motion';
import adminBg    from '../assets/admin_dashboard_background.png';
import systemBg   from '../assets/system_core_background.png';
import stationBg  from '../assets/station_network_background.png';
import vipBg      from '../assets/vip_lounge_background.png';
import precisionBg from '../assets/precision_engineering_background.png';

const pageTitles = {
  '/admin/dashboard':  'Dashboard',
  '/admin/trains':     'Train Management',
  '/admin/journeys':   'Journey Management',
  '/admin/carriages':  'Carriage Management',
  '/admin/routes':     'Route Management',
  '/admin/stations':   'Station Management',
  '/admin/users':      'User Management',
};

// Map each admin route to an existing asset image
const pageBackgrounds = {
  '/admin/dashboard':  adminBg,
  '/admin/trains':     systemBg,
  '/admin/carriages':  systemBg,
  '/admin/journeys':   vipBg,
  '/admin/routes':     stationBg,
  '/admin/stations':   stationBg,
  '/admin/users':      precisionBg,
};

export function AdminLayout() {
  const { sidebarCollapsed } = useUIStore();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Admin';
  const background = pageBackgrounds[location.pathname] || adminBg;

  return (
    <div className="min-h-screen bg-navy flex relative">
      {/* Global admin bg */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img src={background} alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,rgba(7,11,20,0.85) 0%,rgba(7,11,20,0.92) 100%)' }} />
      </div>
      <AdminSidebar />
      <div
        className="flex-1 flex flex-col transition-all duration-250 relative z-10"
        style={{ marginLeft: sidebarCollapsed ? 70 : 240 }}
      >
        <AdminTopBar title={title} />
        <motion.main
          className="flex-1 p-6 overflow-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          key={location.pathname}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
