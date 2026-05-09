import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Train, MapPin, Calendar, LayoutDashboard, Users,
  Layers, ChevronLeft, ChevronRight, Settings, HeadphonesIcon, LogOut
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/trains',    label: 'Schedule',  icon: Calendar },
  { to: '/admin/users',     label: 'Users',     icon: Users },
  { to: '/admin/journeys',  label: 'Reports',   icon: LayoutDashboard },
  { to: '/admin/routes',    label: 'Settings',  icon: Settings },
  { to: '/admin/stations',  label: 'Support',   icon: HeadphonesIcon },
];

export function AdminSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 232 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="fixed left-0 top-0 bottom-0 z-30 flex flex-col"
      style={{
        background: 'rgba(7,11,20,0.95)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(0,229,255,0.08)',
        borderRadius: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[rgba(0,229,255,0.08)] flex-shrink-0">
        {/* Horus Rail logo */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background:'linear-gradient(135deg,#00e5ff22,#007acc44)', border:'1px solid rgba(0,229,255,0.3)' }}>
          <Train className="w-5 h-5 text-[#00e5ff]" />
        </div>
        {!sidebarCollapsed && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div className="text-white font-black text-sm tracking-widest">HORUS</div>
            <div className="text-[#00e5ff] text-xs tracking-widest font-bold">RAIL</div>
          </motion.div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <div className={cn('sidebar-item', isActive && 'active')}
                title={sidebarCollapsed ? label : undefined}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className="text-sm">
                    {label}
                  </motion.span>
                )}
                {isActive && !sidebarCollapsed && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl"
                    style={{ background:'rgba(0,229,255,0.06)', zIndex:-1 }}
                  />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-2 border-t border-[rgba(0,229,255,0.06)] pt-2">
        <button onClick={handleLogout}
          className={cn('sidebar-item w-full', 'hover:text-red-400 hover:bg-red-500/5')}
          title={sidebarCollapsed ? 'Sign Out' : undefined}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={toggleSidebar}
        className="flex items-center justify-center h-10 border-t border-[rgba(0,229,255,0.06)] text-slate-600 hover:text-[#00e5ff] transition-colors">
        {sidebarCollapsed
          ? <ChevronRight className="w-4 h-4" />
          : <ChevronLeft  className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
