import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#f8fafc',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#0f172a' },
            style: { borderLeft: '3px solid #22c55e' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
            style: { borderLeft: '3px solid #ef4444' },
          },
        }}
      />
    </>
  );
}
