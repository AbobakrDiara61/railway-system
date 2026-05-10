import { Outlet } from 'react-router-dom';
import { Train } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageBackground } from '../components/ui/PageBackground';
import authBg from '../assets/auth_page_background.png';

export function AuthLayout() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      <PageBackground src={authBg} opacity={0.25} />

      <div className="w-full relative z-10">

        <Outlet />
      </div>
    </div>
  );
}
