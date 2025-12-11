import React, { useState } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Onboarding from './components/Onboarding';
import ContactForm from './components/ContactForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './hooks/useAuth';

const AppContent = () => {
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          user ? (
            <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />
          ) : (
            <>
              <LandingPage />
              <div className="fixed top-6 right-6 z-50">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="rounded-full border border-white/10 bg-brand-black/50 px-6 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white hover:text-brand-black"
                >
                  LOGIN
                </button>
              </div>
            </>
          )
        } />

        <Route path="/contact" element={<ContactForm />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Protected Client Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['client']}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/onboarding" element={
          <ProtectedRoute allowedRoles={['client']}>
            <Onboarding />
          </ProtectedRoute>
        } />

      </Routes>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AppContent />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
