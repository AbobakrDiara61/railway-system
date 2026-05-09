import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { motion } from 'framer-motion';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      <motion.main
        className="flex-1 pt-16 pb-20 md:pb-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
