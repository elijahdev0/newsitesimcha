import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import './index.css';

// Zustand Store for Auth
import { useAuthStore } from './store/authStore';

// Pages
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Courses from './pages/Courses.tsx';
import Contact from './pages/contact/Contact.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/dashboard/Dashboard.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import ManageCourseDates from './pages/admin/ManageCourseDates.tsx';
import BookingFlow from './pages/booking/BookingFlow.tsx';

// Common Components
import WhatsappFAB from './components/common/WhatsappFAB.tsx';

// Wrapper component for protected admin routes
const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    // Optionally show a loading spinner while checking auth
    return (
       <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-tactical-700"></div>
       </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // Render child routes if authenticated and is admin
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <WhatsappFAB />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book/:courseId" element={<BookingFlow />} />

        {/* Authenticated User Routes (Example - Dashboard might need auth check) */}
        {/* TODO: Add protected route for dashboard if needed */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Add other admin routes here */}
          <Route path="/admin/courses/:id/dates" element={<ManageCourseDates />} />
          {/* Redirect /admin to /admin/dashboard */}
           <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </StrictMode>
);