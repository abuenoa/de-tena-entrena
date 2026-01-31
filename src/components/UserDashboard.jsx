import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, Calendar, TrendingUp, LogOut } from 'lucide-react';
import MetricsDashboard from './shared/MetricsDashboard';
import { useTranslation } from 'react-i18next';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Prepare client object for MetricsDashboard
    // user.uid from auth maps to client.id in Firestore
    const clientUser = user ? { ...user, id: user.uid } : null;

    return (
        <div className="flex min-h-screen w-full flex-col bg-brand-black pb-24 text-white md:pl-24 md:pb-0">
            {/* Desktop Sidebar / Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 z-40 flex w-full justify-around border-t border-white/10 bg-brand-black/90 px-6 py-4 backdrop-blur-md md:top-0 md:h-screen md:w-24 md:flex-col md:justify-start md:gap-12 md:border-r md:border-t-0 md:pt-12">
                <div className="hidden md:flex md:justify-center">
                    {/* Placeholder removed as per user request */}
                </div>
                <button className="flex flex-col items-center gap-1 text-brand-red">
                    <Home size={24} />
                    <span className="text-[10px] font-medium uppercase">{t('nav.home')}</span>
                </button>
                <button className="group flex flex-col items-center gap-1 text-white/30 cursor-not-allowed" title={t('common.coming_soon') || "Próximamente"}>
                    <Calendar size={24} />
                    <span className="text-[10px] font-medium uppercase">{t('nav.plan')}</span>
                </button>
                <button className="group flex flex-col items-center gap-1 text-white/30 cursor-not-allowed" title={t('common.coming_soon') || "Próximamente"}>
                    <TrendingUp size={24} />
                    <span className="text-[10px] font-medium uppercase">{t('nav.stats')}</span>
                </button>
                <button onClick={logout} className="flex flex-col items-center gap-1 text-white/50 hover:text-white md:mt-auto md:mb-8">
                    <LogOut size={24} />
                    <span className="text-[10px] font-medium uppercase">{t('auth.logout')}</span>
                </button>
            </nav>

            {/* Main Content */}
            <main className="flex-1 px-6 py-8 md:px-12 md:py-12">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold">
                            {t('dashboard.welcome')} <span className="text-brand-red">{user?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Athlete'}</span>
                        </h1>
                        <p className="text-white/50">{t('dashboard.week_phase')}</p>
                    </div>
                    <button
                        onClick={() => navigate('/profile')}
                        className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/5 transition-transform hover:scale-105"
                    >
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <img src={`https://ui-avatars.com/api/?name=${user?.displayName || user?.name || 'User'}&background=D62828&color=fff`} alt="Profile" />
                        )}
                    </button>
                </header>

                {/* Unified Metrics Dashboard */}
                {clientUser && <MetricsDashboard client={clientUser} />}
            </main>
        </div>
    );
};

export default UserDashboard;
