import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreHorizontal, X, MessageCircle, User, ChevronRight } from 'lucide-react';

const mockClients = [
    { id: 1, name: 'Alex Johnson', plan: 'Hypertrophy Pro', status: 'Active', lastCheckIn: '2h ago', img: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=random' },
    { id: 2, name: 'Sarah Connor', plan: 'Strength Elite', status: 'Active', lastCheckIn: '1d ago', img: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=random' },
    { id: 3, name: 'Mike Ross', plan: 'Endurance Basic', status: 'Paused', lastCheckIn: '5d ago', img: 'https://ui-avatars.com/api/?name=Mike+Ross&background=random' },
    { id: 4, name: 'Jessica Pearson', plan: 'Hybrid Athlete', status: 'Active', lastCheckIn: '3h ago', img: 'https://ui-avatars.com/api/?name=Jessica+Pearson&background=random' },
    { id: 5, name: 'Harvey Specter', plan: 'Strength Elite', status: 'Active', lastCheckIn: 'Just now', img: 'https://ui-avatars.com/api/?name=Harvey+Specter&background=random' },
];

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [selectedClient, setSelectedClient] = useState(null);

    return (
        <div className="flex min-h-screen w-full bg-brand-black text-white">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-white/10 bg-surface p-6 md:flex">
                <div className="mb-12 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-brand-red"></div>
                    <span className="font-display text-xl font-bold tracking-tighter">DE TENA</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <button className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-3 font-medium text-white">
                        <User size={20} /> Clients
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-white/50 hover:bg-white/5 hover:text-white">
                        <MessageCircle size={20} /> Messages
                    </button>
                </nav>

                <div className="flex items-center gap-3 border-t border-white/10 pt-6">
                    <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=D62828&color=fff`} alt="Profile" className="h-10 w-10 rounded-full" />
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-bold">{user?.name}</p>
                        <button onClick={logout} className="text-xs text-brand-red hover:underline">Logout</button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12">
                <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold">Clients</h1>
                        <p className="text-white/50">Manage your athletes.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search client..."
                                className="rounded-full border border-white/10 bg-surface py-2 pl-10 pr-4 text-sm text-white focus:border-brand-red focus:outline-none"
                            />
                        </div>
                        <button className="flex items-center gap-2 rounded-full border border-white/10 bg-surface px-4 py-2 text-sm font-medium hover:bg-white/5">
                            <Filter size={16} /> Filter
                        </button>
                    </div>
                </header>

                {/* Client Grid */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
                    <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-white/10 bg-white/5 p-4 text-xs font-bold uppercase tracking-wider text-white/50">
                        <div className="w-10"></div>
                        <div>Name</div>
                        <div className="hidden md:block">Plan</div>
                        <div>Status</div>
                        <div className="hidden md:block">Last Check-in</div>
                        <div></div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {mockClients.map((client) => (
                            <div
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className="group grid cursor-pointer grid-cols-[auto_1fr_1fr_1fr_1fr_auto] items-center gap-4 p-4 transition-colors hover:bg-white/[0.02]"
                            >
                                <img src={client.img} alt={client.name} className="h-10 w-10 rounded-full" />
                                <div className="font-bold">{client.name}</div>
                                <div className="hidden text-sm text-white/60 md:block">{client.plan}</div>
                                <div>
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${client.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {client.status}
                                    </span>
                                </div>
                                <div className="hidden text-sm text-white/40 md:block">{client.lastCheckIn}</div>
                                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                                    <button className="rounded-full p-2 hover:bg-white/10">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Side Drawer */}
            <AnimatePresence>
                {selectedClient && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedClient(null)}
                            className="fixed inset-0 z-50 bg-brand-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/10 bg-surface shadow-2xl"
                        >
                            <div className="flex h-full flex-col">
                                <div className="flex items-center justify-between border-b border-white/10 p-6">
                                    <h2 className="font-display text-xl font-bold">Client Details</h2>
                                    <button onClick={() => setSelectedClient(null)} className="rounded-full p-2 hover:bg-white/10">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="mb-8 flex flex-col items-center">
                                        <img src={selectedClient.img} alt={selectedClient.name} className="mb-4 h-24 w-24 rounded-full border-2 border-brand-red" />
                                        <h3 className="font-display text-2xl font-bold">{selectedClient.name}</h3>
                                        <p className="text-white/50">{selectedClient.plan}</p>

                                        <div className="mt-6 flex gap-4">
                                            <button className="flex items-center gap-2 rounded-full bg-brand-red px-6 py-2 font-bold text-white transition-transform hover:scale-105">
                                                <MessageCircle size={18} /> Chat
                                            </button>
                                            <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 font-bold transition-colors hover:bg-white/10">
                                                <User size={18} /> Profile
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="rounded-xl border border-white/10 bg-brand-black/50 p-4">
                                            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">Recent Activity</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Workout Completed</span>
                                                    <span className="text-white/40">2h ago</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Weight Updated</span>
                                                    <span className="text-white/40">1d ago</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-white/10 bg-brand-black/50 p-4">
                                            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">Stats</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="rounded-lg bg-white/5 p-3">
                                                    <div className="text-xs text-white/50">Weight</div>
                                                    <div className="text-xl font-bold">78.5 kg</div>
                                                </div>
                                                <div className="rounded-lg bg-white/5 p-3">
                                                    <div className="text-xs text-white/50">Height</div>
                                                    <div className="text-xl font-bold">182 cm</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
