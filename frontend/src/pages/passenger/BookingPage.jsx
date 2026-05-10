import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { createBooking } from '../../api/bookings.api';
import toast from 'react-hot-toast';
import { PageBackground } from '../../components/ui/PageBackground';
import bookingBg from '../../assets/booking_flow_background.png';

const STEPS = ['Route Selection', 'Passenger Details', 'Payment', 'Confirmation'];

const PAYMENT_METHODS = [
  { id:'credit_card', label:'CREDIT CARD', sub:'Pay with Visa, Mastercard...', icon:'💳',
    iconBg:'linear-gradient(135deg,rgba(0,229,255,0.15),rgba(0,100,200,0.15))',
    border:'rgba(0,229,255,0.4)', glow:'rgba(0,229,255,0.15)' },
  { id:'wallet', label:'WALLET', sub:'Digital wallets, NilePay...', icon:'⊕',
    iconBg:'linear-gradient(135deg,rgba(168,85,247,0.12),rgba(100,50,200,0.12))',
    border:'rgba(168,85,247,0.25)', glow:'rgba(168,85,247,0.1)' },
  { id:'cash', label:'CASH', sub:'Pay at station...', icon:'👑',
    iconBg:'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(160,100,0,0.12))',
    border:'rgba(245,158,11,0.25)', glow:'rgba(245,158,11,0.1)' },
];

export function BookingPage() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const location  = useLocation();
 
  const { selectedSeats = [], total = 0, journey = null } = location.state ?? {};

  const [step,      setStep]      = useState(1);
  const [payMethod, setPayMethod] = useState('credit_card');
  const [loading,   setLoading]   = useState(false);
  const [card,      setCard]      = useState({ number:'', expiry:'', cvv:'', name:'' });
 
  const journeyDisplay = {
    train: journey?.train_number ?? journey?.train_id ?? '—',
    from:  journey?.origin_station_name ?? '—',
    to:    journey?.destination_station_name ?? '—',
    date:  journey?.departure_date_time
           ? new Date(journey.departure_date_time).toLocaleDateString('en-GB')
           : '—',
    seats: selectedSeats.map(s => s.seat_number).join(', ') || '—',
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await createBooking({
        journey_id:            id,
        payment_method:        payMethod,
        total_amount:          total,
        payment_status:        'paid',
        payment_transaction_id:`TXN-${Date.now()}`,
        status:                'confirmed',
        booking_date:          new Date(),
      });
      setStep(4);
    } catch {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy relative">
      <PageBackground src={bookingBg} opacity={0.15} fixed />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Stepper */}
        <div className="glass mb-8 rounded-2xl overflow-hidden border border-[rgba(245,158,11,0.15)]">
          <div className="flex">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const isActive = step === n;
              const isDone   = step > n;
              return (
                <div key={s} className="flex-1 relative">
                  <div className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${
                    isActive ? 'text-black' : isDone ? 'text-[#4ade80]' : 'text-slate-600'
                  }`} style={isActive ? {
                    background:'linear-gradient(135deg,#f59e0b,#d97706)',
                  } : isDone ? { background:'rgba(34,197,94,0.08)' } : {}}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      isActive ? 'bg-black/20' : isDone ? 'bg-[#4ade80] text-black' : 'bg-white/8 text-slate-600'
                    }`}>
                      {isDone ? '✓' : n}
                    </span>
                    <span className="hidden sm:block">{n}. {s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-[rgba(255,255,255,0.06)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {step === 4 ? (
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            className="max-w-lg mx-auto text-center glass p-12 rounded-2xl border border-[rgba(74,222,128,0.2)]">
            <div className="w-20 h-20 rounded-full bg-[rgba(74,222,128,0.12)] border border-[rgba(74,222,128,0.3)] flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#4ade80]" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Booking Confirmed!</h2>
            <p className="text-slate-400 mb-8">Your ticket has been booked successfully.</p>
            <div className="glass-sm p-4 rounded-xl mb-8 text-left space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-500">From</span><span className="text-white font-medium">{journeyDisplay.from}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">To</span><span className="text-white font-medium">{journeyDisplay.to}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Seats</span><span className="text-white font-medium">{journeyDisplay.seats}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Total Paid</span><span className="text-[#f59e0b] font-bold">EGP {total.toLocaleString()}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/my-bookings')} className="btn-navy flex-1 py-3 text-sm rounded-xl font-semibold">View My Trips</button>
              <button onClick={() => navigate('/')} className="btn-gold flex-1 py-3 text-sm rounded-xl font-bold">Back to Home</button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="route"
                    initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                    className="glass p-6 rounded-2xl border border-[rgba(0,229,255,0.12)]">
                    <h3 className="text-white font-semibold mb-4">Route Summary</h3>
                    <div className="space-y-3">
                      {[
                        ['From',  journeyDisplay.from],
                        ['To',    journeyDisplay.to],
                        ['Date',  journeyDisplay.date],
                        ['Seats', journeyDisplay.seats],
                      ].map(([k,v]) => (
                        <div key={k} className="flex justify-between text-sm">
                          <span className="text-slate-500">{k}</span>
                          <span className="text-white font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="passenger"
                    initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                    className="glass p-6 rounded-2xl border border-[rgba(0,229,255,0.12)] space-y-4">
                    <h3 className="text-white font-semibold mb-4">Passenger Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-sm text-slate-400 mb-1 block">First Name</label><input className="input-glass" placeholder="Ahmed" /></div>
                      <div><label className="text-sm text-slate-400 mb-1 block">Last Name</label><input className="input-glass" placeholder="Hassan" /></div>
                      <div className="col-span-2"><label className="text-sm text-slate-400 mb-1 block">National ID</label><input className="input-glass" placeholder="29901010100001" /></div>
                      <div><label className="text-sm text-slate-400 mb-1 block">Phone</label><input className="input-glass" placeholder="+20 100 000 0000" /></div>
                      <div><label className="text-sm text-slate-400 mb-1 block">Email</label><input className="input-glass" placeholder="you@example.com" /></div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="payment"
                    initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {PAYMENT_METHODS.map(pm => (
                        <button key={pm.id} onClick={() => setPayMethod(pm.id)}
                          className="rounded-2xl p-5 text-center transition-all flex flex-col items-center gap-3"
                          style={{
                            background: payMethod === pm.id ? pm.iconBg : 'rgba(10,18,35,0.6)',
                            border: `2px solid ${payMethod === pm.id ? pm.border : 'rgba(255,255,255,0.06)'}`,
                            boxShadow: payMethod === pm.id ? `0 0 20px ${pm.glow}` : 'none',
                          }}>
                          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                            style={{ background: pm.iconBg, border:`1px solid ${pm.border}` }}>
                            {pm.icon}
                          </div>
                          <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                            style={{ borderColor: payMethod === pm.id ? pm.border : 'rgba(255,255,255,0.15)' }}>
                            {payMethod === pm.id && <div className="w-2 h-2 rounded-full" style={{ background: pm.border }} />}
                          </div>
                          <div>
                            <div className="text-white font-bold text-sm tracking-wider">{pm.label}</div>
                            <div className="text-slate-500 text-xs mt-0.5">{pm.sub}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {payMethod === 'credit_card' && (
                      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                        className="glass rounded-2xl p-6 border border-[rgba(0,229,255,0.12)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-sm text-slate-400 font-medium">Card Number</label>
                            <input type="text" placeholder="0000 0000 0000 0000"
                              value={card.number} onChange={e => setCard({...card, number: e.target.value})}
                              maxLength={19} className="input-glass font-mono text-lg tracking-widest" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-slate-400 font-medium">Expiry Date</label>
                            <select className="input-glass" value={card.expiry}
                              onChange={e => setCard({...card, expiry: e.target.value})}>
                              <option value="">MM/YY</option>
                              {Array.from({length:48},(_,i) => {
                                const m=(i%12)+1, y=2024+Math.floor(i/12);
                                return <option key={i}>{String(m).padStart(2,'0')}/{y}</option>;
                              })}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-slate-400 font-medium">CVV</label>
                            <input type="password" placeholder="123" maxLength={4}
                              value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value})}
                              className="input-glass" />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-sm text-slate-400 font-medium">Cardholder Name</label>
                            <input type="text" placeholder="A. Hassan"
                              value={card.name} onChange={e => setCard({...card, name: e.target.value})}
                              className="input-glass" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <button onClick={() => setStep(s => s-1)}
                    className="btn-navy flex-1 py-3 text-sm rounded-xl font-semibold flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                )}
                {step < 3 ? (
                  <button onClick={() => setStep(s => s+1)}
                    className="btn-gold flex-1 py-3 text-sm rounded-xl font-bold flex items-center justify-center gap-2">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleConfirm} disabled={loading}
                    className="btn-gold flex-1 py-3 text-sm rounded-xl font-bold gold-pulse flex items-center justify-center gap-2">
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Processing...</>
                      : <><CreditCard className="w-4 h-4" /> CONFIRM PAYMENT</>
                    }
                  </button>
                )}
              </div>
            </div>

            {/* Journey Summary Sidebar */}
            <div className="glass rounded-2xl p-5 border border-[rgba(245,158,11,0.15)] h-fit">
              <h3 className="text-white font-bold text-base mb-5">Journey Summary</h3>
              <div className="space-y-3 mb-5">
                {[
                  ['Train', journeyDisplay.train],
                  ['From',  journeyDisplay.from],
                  ['To',    journeyDisplay.to],
                  ['Date',  journeyDisplay.date],
                  ['Seats', journeyDisplay.seats],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-slate-500">{k}:</span>
                    <span className="text-white font-medium text-right max-w-[55%]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[rgba(245,158,11,0.2)] pt-4">
                <div className="text-slate-400 text-sm mb-1">Total Price:</div>
                <div className="text-3xl font-black"
                  style={{ color:'#f59e0b', textShadow:'0 0 20px rgba(245,158,11,0.4)' }}>
                  EGP {Number(total).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}