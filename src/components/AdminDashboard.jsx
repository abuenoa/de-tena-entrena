import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AnimatePresence } from 'framer-motion';
import { MessageCircle, User, ClipboardList, Dumbbell } from 'lucide-react';
import ClientList from './admin/ClientList';
import ContactRequestsList from './admin/ContactRequestsList';
import ClientDetail from './admin/ClientDetail';
import ContactRequestDetail from './admin/ContactRequestDetail';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'requests'
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    return (
        <div className="flex min-h-screen w-full bg-brand-black text-white">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-white/10 bg-surface p-6 md:flex">
                <div className="mb-12 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                        <Dumbbell size={20} />
                    </div>
                    <span className="font-display text-xl font-bold tracking-tighter">DE TENA</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${activeTab === 'clients' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                    >
                        <User size={20} /> {t('admin.clients')}
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${activeTab === 'requests' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                    >
                        <ClipboardList size={20} /> {t('admin.requests')}
                    </button>
                    <button
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-white/30 cursor-not-allowed"
                        title={t('common.coming_soon') || "Próximamente"}
                    >
                        <MessageCircle size={20} /> {t('admin.messages')}
                    </button>
                </nav>

                <div className="flex items-center gap-3 border-t border-white/10 pt-6">
                    <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=D62828&color=fff`} alt="Profile" className="h-10 w-10 rounded-full" />
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-bold">{user?.name}</p>
                        <button onClick={logout} className="text-xs text-brand-red hover:underline">{t('auth.logout')}</button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen">
                {activeTab === 'clients' && (
                    <ClientList onSelectClient={setSelectedClient} />
                )}
                {activeTab === 'requests' && (
                    <ContactRequestsList onSelectRequest={setSelectedRequest} />
                )}
            </main>

            {/* Side Drawers */}
            <AnimatePresence>
                {selectedClient && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-brand-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedClient(null)}
                        />
                        <ClientDetail
                            client={selectedClient}
                            onClose={() => setSelectedClient(null)}
                        />
                    </>
                )}
                {selectedRequest && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-brand-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedRequest(null)}
                        />
                        <ContactRequestDetail
                            request={selectedRequest}
                            onClose={() => setSelectedRequest(null)}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
