import React, { useState } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import { AuthProvider, useAuth } from './hooks/useAuth';

import Onboarding from './components/Onboarding';

const AppContent = () => {
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role === 'client') {
    if (showOnboarding) {
      return <Onboarding onComplete={() => setShowOnboarding(false)} />;
    }
    return <UserDashboard onStartOnboarding={() => setShowOnboarding(true)} />;
  }

  return (
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
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Layout>
        <AppContent />
      </Layout>
    </AuthProvider>
  );
}

export default App;
