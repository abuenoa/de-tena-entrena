import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Search, Filter, ChevronRight, UserPlus } from 'lucide-react';
import CreateClientModal from './CreateClientModal';

const ClientList = ({ onSelectClient }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'users'), where('role', '==', 'client'));
            const querySnapshot = await getDocs(q);
            const clientsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClients(clientsData);
        } catch (error) {
            console.error("Error fetching clients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-white/50">Loading clients...</div>;

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold">Clients</h1>
                    <p className="text-white/50">Manage your athletes.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-full border border-white/10 bg-surface py-2 pl-10 pr-4 text-sm text-white focus:border-brand-red focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 font-bold text-white transition-colors hover:bg-red-700"
                    >
                        <UserPlus size={18} />
                        <span className="hidden md:inline">Add Client</span>
                    </button>
                </div>
            </header>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 border-b border-white/10 bg-white/5 p-4 text-xs font-bold uppercase tracking-wider text-white/50">
                    <div className="w-10"></div>
                    <div>Name</div>
                    <div className="hidden md:block">Email</div>
                    <div></div>
                </div>

                <div className="divide-y divide-white/5">
                    {filteredClients.map((client) => (
                        <div
                            key={client.id}
                            onClick={() => onSelectClient(client)}
                            className="group grid cursor-pointer grid-cols-[auto_1fr_1fr_auto] items-center gap-4 p-4 transition-colors hover:bg-white/[0.02]"
                        >
                            <img
                                src={client.photoURL || `https://ui-avatars.com/api/?name=${client.name}&background=random`}
                                alt={client.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="font-bold">{client.name}</div>
                            <div className="hidden text-sm text-white/60 md:block">{client.email}</div>
                            <div className="opacity-0 transition-opacity group-hover:opacity-100">
                                <button className="rounded-full p-2 hover:bg-white/10">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredClients.length === 0 && (
                        <div className="p-8 text-center text-white/50">No clients found.</div>
                    )}
                </div>
            </div>

            <CreateClientModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    fetchClients(); // Refresh list
                }}
            />
        </div>
    );
};

export default ClientList;
