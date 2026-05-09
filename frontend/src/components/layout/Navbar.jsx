import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, Menu, X, User, LogOut, Settings, Ticket, Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const navLinks = [
  { label: 'Home',         path: '/' },
  { label: 'Search',       path: '/trains/search' },
  { label: 'My Trips',     path: '/my-bookings' },
  { label: 'Profile',      path: '/profile' },
];

export function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
            <Train className="w-5 h-5 text-black" />
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-black text-base tracking-widest">RAIL </span>
            <span className="text-[#f59e0b] font-black text-base tracking-widest">EGYPT</span>
          </div>
        </Link>

        {/* Center nav links — desktop */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/8">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Language toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1 border border-white/10 text-xs font-bold">
                <span className="text-white">EN</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-500">AR</span>
              </div>

              {/* Bell */}
              <button className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#f59e0b]" />
              </button>

              {/* Profile */}
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[rgba(0,229,255,0.25)] transition-all">
                  <div className="w-7 h-7 rounded-full gradient-gold flex items-center justify-center">
                    <span className="text-black text-xs font-black">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm text-white font-medium">{user?.name?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity:0, y:8, scale:0.95 }}
                      animate={{ opacity:1, y:0, scale:1 }}
                      exit={{  opacity:0, y:8, scale:0.95 }}
                      className="absolute right-0 top-full mt-2 w-52 glass rounded-xl border border-[rgba(0,229,255,0.12)] overflow-hidden shadow-2xl"
                    >
                      <div className="px-4 py-3 border-b border-white/8">
                        <div className="text-white font-semibold text-sm">{user?.name}</div>
                        <div className="text-slate-500 text-xs truncate">{user?.email}</div>
                      </div>
                      <div className="py-1">
                        <Link to="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        <Link to="/my-bookings" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                          <Ticket className="w-4 h-4" /> My Trips
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin/dashboard" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#00e5ff] hover:bg-[rgba(0,229,255,0.06)] transition-colors">
                            <Settings className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-white/8 py-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 w-full transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <button onClick={() => navigate('/login')}
              className="btn-gold px-5 py-2 text-sm rounded-lg font-bold">
              Login
            </button>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{   opacity:0, height:0 }}
            className="md:hidden border-t border-white/8 bg-[rgba(7,11,20,0.96)]"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-white/8 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
