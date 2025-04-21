import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Pages
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Courses from './pages/Courses.tsx';
import Contact from './pages/contact/Contact.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/dashboard/Dashboard.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import BookingFlow from './pages/booking/BookingFlow.tsx';

// Common Components
import WhatsappFAB from './components/common/WhatsappFAB.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <WhatsappFAB />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/book/:courseId" element={<BookingFlow />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </StrictMode>
);