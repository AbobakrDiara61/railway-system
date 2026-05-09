import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Auth pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Passenger pages
import { HomePage } from '../pages/passenger/HomePage';
import { SearchResultsPage } from '../pages/passenger/SearchResultsPage';
import { JourneyDetailsPage } from '../pages/passenger/JourneyDetailsPage';
import { BookingPage } from '../pages/passenger/BookingPage';
import { MyBookingsPage } from '../pages/passenger/MyBookingsPage';
import { BookingDetailsPage } from '../pages/passenger/BookingDetailsPage';
import { ProfilePage } from '../pages/passenger/ProfilePage';

// Admin pages
import { DashboardPage } from '../pages/admin/DashboardPage';
import { TrainsPage } from '../pages/admin/TrainsPage';
import { JourneysPage } from '../pages/admin/JourneysPage';
import { CarriagesPage } from '../pages/admin/CarriagesPage';
import { RoutesPage } from '../pages/admin/RoutesPage';
import { StationsPage } from '../pages/admin/StationsPage';
import { UsersPage } from '../pages/admin/UsersPage';

// Error pages
import { AccessDeniedPage } from '../pages/AccessDeniedPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  // Main (passenger) routes
  {
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/trains/search', element: <SearchResultsPage /> },
      { path: '/journeys/:id', element: <JourneyDetailsPage /> },
      { path: '/booking/:journeyId', element: <BookingPage /> },
      { path: '/my-bookings', element: <MyBookingsPage /> },
      { path: '/my-bookings/:id', element: <BookingDetailsPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
  // Admin routes
  {
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { path: '/admin/dashboard', element: <DashboardPage /> },
      { path: '/admin/trains', element: <TrainsPage /> },
      { path: '/admin/journeys', element: <JourneysPage /> },
      { path: '/admin/carriages', element: <CarriagesPage /> },
      { path: '/admin/routes', element: <RoutesPage /> },
      { path: '/admin/stations', element: <StationsPage /> },
      { path: '/admin/users', element: <UsersPage /> },
    ],
  },
  // Error pages
  { path: '/access-denied', element: <AccessDeniedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
