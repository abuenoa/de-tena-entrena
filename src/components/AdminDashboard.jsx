import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AnimatePresence } from 'framer-motion';
import { MessageCircle, User, ClipboardList, Dumbbell, LogOut, Home } from 'lucide-react';
import ClientList from './admin/ClientList';
import ContactRequestsList from './admin/ContactRequestsList';
import ClientDetail from './admin/ClientDetail';
import ContactRequestDetail from './admin/ContactRequestDetail';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'requests'
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const navigate = useNavigate();

    const handleViewClient = async (clientId, email) => {
        try {
            let clientData = null;

            if (clientId) {
                const docRef = doc(db, 'users', clientId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    clientData = { id: docSnap.id, ...docSnap.data() };
                }
            }

            if (!clientData && email) {
                const q = query(collection(db, 'users'), where('email', '==', email), where('role', '==', 'client'));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    clientData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
                }
            }

            if (clientData) {
                setSelectedRequest(null);
                setActiveTab('clients');
                setSelectedClient(clientData);
            } else {
                alert(t('admin.client_not_found', 'Client not found'));
            }
        } catch (error) {
            console.error("Error navigating to client:", error);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-brand-black pb-24 text-white md:pl-24 md:pb-0">
            {/* Desktop Sidebar / Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 z-40 flex w-full justify-around border-t border-white/10 bg-brand-black/90 px-6 py-4 backdrop-blur-md md:top-0 md:h-screen md:w-24 md:flex-col md:justify-start md:gap-12 md:border-r md:border-t-0 md:pt-12">
                <div className="hidden md:flex md:justify-center">
                    {/* Logo Placeholder if needed */}
                </div>

                <button
                    onClick={() => setActiveTab('clients')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'clients' ? 'text-brand-red' : 'text-white/50 hover:text-white'}`}
                >
                    <User size={24} />
                    <span className="text-[10px] font-medium uppercase">{t('admin.clients')}</span>
                </button>

                <button
                    onClick={() => setActiveTab('requests')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'requests' ? 'text-brand-red' : 'text-white/50 hover:text-white'}`}
                >
                    <ClipboardList size={24} />
                    <span className="text-[10px] font-medium uppercase">{t('admin.requests')}</span>
                </button>

                <button
                    className="flex flex-col items-center gap-1 text-white/30 cursor-not-allowed group"
                    title={t('common.coming_soon') || "Próximamente"}
                >
                    <MessageCircle size={24} />
                    <span className="text-[10px] font-medium uppercase">{t('admin.messages')}</span>
                </button>


                <button onClick={logout} className="flex flex-col items-center gap-1 text-white/50 hover:text-white md:mt-auto md:mb-8">
                    <LogOut size={24} />
                    <span className="text-[10px] font-medium uppercase">{t('auth.logout')}</span>
                </button>
            </nav>

            {/* Main Content */}
            <main className="flex-1 px-6 py-8 md:px-12 md:py-12 overflow-y-auto h-screen">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold">
                            ADMIN <span className="text-brand-red">PANEL</span>
                        </h1>
                        <p className="text-white/50">Manage your athletes</p>
                    </div>
                    <button
                        onClick={() => navigate('/profile')}
                        className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/5 transition-transform hover:scale-105"
                    >
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=D62828&color=fff`} alt="Profile" className="h-full w-full object-cover" />
                        )}
                    </button>
                </header>

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
                            className="fixed inset-0 z-50 bg-brand-black/80 backdrop-blur-sm"
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
                            className="fixed inset-0 z-50 bg-brand-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedRequest(null)}
                        />
                        <ContactRequestDetail
                            request={selectedRequest}
                            onClose={() => setSelectedRequest(null)}
                            onViewClient={handleViewClient}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
