import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { logout as logoutApi } from '../../api/auth.api';
import toast from 'react-hot-toast';

export function AdminTopBar({ title }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logoutApi(); } catch {}
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <header className="h-16 glass border-b border-white/8 flex items-center justify-between px-6" style={{ borderRadius: 0 }}>
      <h1 className="text-white font-semibold text-lg">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold-400 rounded-full" />
        </button>
        <Link to="/profile" className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">
          <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-black text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-white leading-none">{user?.name || 'Admin'}</div>
            <div className="text-xs text-slate-400 capitalize">{user?.role || 'admin'}</div>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
