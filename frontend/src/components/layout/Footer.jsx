import { Link } from 'react-router-dom';
import { Train, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="glass border-t border-white/8 mt-16" style={{ borderRadius: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
                <Train className="w-5 h-5 text-black" />
              </div>
              <span className="text-white font-bold text-lg">Egypt Railways</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              The premier Egyptian railway booking platform. Travel in comfort and style across Egypt's extensive rail network.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-gold-400" />
                Cairo Central Station, Cairo, Egypt
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-gold-400" />
                +20 2 2575 3555
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-gold-400" />
                support@egyptrailways.gov.eg
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/trains/search', label: 'Search Trains' },
                { to: '/my-bookings', label: 'My Bookings' },
                { to: '/profile', label: 'Profile' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-slate-400 text-sm hover:text-gold-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-2">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Refund Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 text-sm hover:text-gold-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 Egypt Railways. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <span className="status-dot online" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
