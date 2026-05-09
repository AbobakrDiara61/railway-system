import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const DEV_BYPASS = import.meta.env.DEV;

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (DEV_BYPASS) {
    // Auto-inject demo admin session in dev so all admin pages are accessible
    const store = useAuthStore.getState();
    if (!store.isAuthenticated) {
      store.setAuth(
        { id: 99, name: 'Demo Admin', email: 'admin@rail.eg', role: 'admin' },
        'dev-admin-token'
      );
    }
    return children;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin())       return <Navigate to="/access-denied" replace />;

  return children;
}

