import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowLeftRight, Train, Shield, Ticket, ChevronRight, Wifi, Zap } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { PageBackground } from '../../components/ui/PageBackground';
import homeBg from '../../assets/railway_home_screen.png';

const popularRoutes = [
  {
    from: 'Cairo', to: 'Alexandria',
    fromSub: 'Ramses Station', toSub: 'Misr Station',
    duration: '2h 30m', price: '350', img: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=400&q=70',
  },
  {
    from: 'Luxor', to: 'Aswan',
    fromSub: 'Luxor Central', toSub: 'Aswan Station',
    duration: '3h 45m', price: '350', img: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=400&q=70',
  },
  {
    from: 'Giza', to: 'Sharm El Sheikh',
    fromSub: 'Giza Station', toSub: 'East Sinai',
    duration: '7h 00m', price: '350', img: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400&q=70',
  },
];

const features = [
  { icon: Train,  title: 'Futuristic Fleet',    desc: 'Experience our high-speed, eco-friendly trains with luxury amenities.',      color: 'text-cyan-400', glow: 'rgba(0,229,255,0.2)' },
  { icon: Ticket, title: 'Seamless Booking',    desc: 'Effortlessly plan and manage your journeys with our intuitive platform.',    color: 'text-yellow-400', glow: 'rgba(245,158,11,0.2)' },
  { icon: Shield, title: 'Premium Service',     desc: 'Enjoy personalized service, dedicated lounges, and onboard comfort.',       color: 'text-purple-400', glow: 'rgba(168,85,247,0.2)' },
];

export function HomePage() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo]     = useState('');
  const [date, setDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'));

  const swap = () => { setFrom(to); setTo(from); };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/trains/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
  };

  return (
    <div className="bg-navy">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <PageBackground src={homeBg} opacity={0.4} />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 w-full">
          {/* Navbar brand */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <Train className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-white font-black text-xl tracking-widest">RAIL</span>
              <span className="text-[#f59e0b] font-black text-xl tracking-widest"> EGYPT</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-black leading-tight mb-6"
          >
            <span className="text-white">Travel Across Egypt,</span>{' '}
            <span className="text-[#f59e0b]">Effortlessly</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg mb-10 max-w-xl"
          >
            Book premium train tickets across Egypt's extensive rail network. Fast, safe, and comfortable.
          </motion.p>

          {/* Search box */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-5 rounded-2xl max-w-2xl"
            style={{ border: '1px solid rgba(245,158,11,0.2)' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              {/* From */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1 pl-1">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f59e0b]" />
                  <input
                    type="text" placeholder="Cairo Ramses Station"
                    value={from} onChange={e => setFrom(e.target.value)}
                    className="input-glass pl-10" required
                  />
                </div>
              </div>

              {/* Swap + To */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1 pl-1">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f59e0b]" />
                  <input
                    type="text" placeholder="Aswan Station"
                    value={to} onChange={e => setTo(e.target.value)}
                    className="input-glass pl-10" required
                  />
                  <motion.button
                    type="button" onClick={swap}
                    whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}
                    className="absolute -left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0a1220] border border-[rgba(245,158,11,0.3)] flex items-center justify-center z-10 hidden sm:flex"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#f59e0b]" />
                  </motion.button>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1 pl-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f59e0b]" />
                  <input
                    type="date" value={date}
                    onChange={e => setDate(e.target.value)}
                    min={formatDate(new Date(), 'yyyy-MM-dd')}
                    className="input-glass pl-10"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm gold-pulse"
            >
              <Train className="w-4 h-4" />
              Search Trains
            </button>
          </motion.form>
        </div>
      </section>

      {/* ── POPULAR ROUTES ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Popular Routes</h2>
            <p className="text-slate-500 text-sm mt-1">Most booked destinations this season</p>
          </div>
          <button
            onClick={() => navigate('/trains/search')}
            className="flex items-center gap-1 text-[#f59e0b] text-sm hover:opacity-80 transition-opacity"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {popularRoutes.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="ticket-card cursor-pointer group"
              onClick={() => navigate(`/trains/search?from=${r.from}&to=${r.to}`)}
            >
              {/* Route image */}
              <div className="h-36 overflow-hidden rounded-t-[13px]">
                <img src={r.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
              </div>
              {/* Content */}
              <div className="p-5">
                <div className="text-white font-bold text-lg mb-1">{r.from} to {r.to}</div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-slate-500">{r.fromSub}</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-xs text-slate-500">{r.toSub}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">From</div>
                    <span className="text-[#f59e0b] font-bold text-xl">{r.price}</span>
                    <span className="text-[#f59e0b] text-sm ml-1">EGP</span>
                  </div>
                  <button className="btn-gold px-4 py-2 text-xs rounded-lg font-bold">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-white mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, color, glow }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="glass glass-hover p-6 rounded-2xl"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: glow, border: `1px solid ${glow}` }}
              >
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <Train className="w-4 h-4 text-black" />
            </div>
            <span className="text-white font-black tracking-widest text-sm">RAIL EGYPT</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <span>Quick Links</span>
            <span>Destinations</span>
            <span>About</span>
            <span>Contact</span>
          </div>
          <div className="text-xs text-slate-600">
            © 2024 Rail Egypt. +91 26 00 7299 · www.conorailegypt.com
          </div>
        </div>
      </footer>
    </div>
  );
}
