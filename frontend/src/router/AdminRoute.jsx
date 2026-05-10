import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin())       return <Navigate to="/access-denied" replace />;

  return children;
}