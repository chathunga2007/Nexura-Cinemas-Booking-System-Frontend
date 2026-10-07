import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AiChatWidget from './components/AiChatWidget';

import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import ConcessionsPage from './pages/ConcessionsPage';
import CheckoutPage from './pages/CheckoutPage';
import TicketSuccess from './pages/TicketSuccess';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import ExperiencesPage from './pages/ExperiencesPage';
import TheatresPage from './pages/TheatresPage';
import AboutPage from './pages/AboutPage';
import WatchlistPage from './pages/WatchlistPage';
import ProfilePage from './pages/ProfilePage';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#121522',
            color: '#F8FAFC',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          },
          success: {
            iconTheme: {
              primary: '#F43F5E',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      {/* Conditionally Render Dedicated Admin Navbar vs Customer Cinema Navbar */}
      {isAdmin ? <AdminNavbar /> : <Navbar />}

      {/* Main Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/booking/:showTimeId" element={<SeatSelection />} />
          <Route path="/concessions" element={<ConcessionsPage />} />
          <Route path="/experiences" element={<ExperiencesPage />} />
          <Route path="/theatres" element={<TheatresPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/booking/ticket/:reference" element={<TicketSuccess />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Public Customer Footer & AI Assistant (hidden in Admin operations) */}
      {!isAdmin && <Footer />}
      {!isAdmin && <AiChatWidget />}

      {/* Global Auth Modal for Login and Registration */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <AppLayout />
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}
