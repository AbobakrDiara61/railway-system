import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const DEV_BYPASS = import.meta.env.DEV;

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // In development: if no auth, seed a demo passenger session automatically
  if (!isAuthenticated && DEV_BYPASS) {
    // Auto-inject demo session so pages render without a real backend
    const store = useAuthStore.getState();
    if (!store.isAuthenticated) {
      store.setAuth(
        { id: 1, name: 'Demo Passenger', email: 'demo@rail.eg', role: 'passenger' },
        'dev-token'
      );
    }
  }

  if (!isAuthenticated && !DEV_BYPASS) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
