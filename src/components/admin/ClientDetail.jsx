import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MessageCircle, User, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const ClientDetail = ({ client, onClose }) => {
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        const fetchMetrics = async () => {
            if (!client?.id) return;
            try {
                const q = query(collection(db, `users/${client.id}/metrics`), orderBy('date', 'asc'));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    date: new Date(doc.data().date).toLocaleDateString()
                }));
                setMetrics(data);
            } catch (error) {
                console.error("Error fetching metrics:", error);
            }
        };
        fetchMetrics();
    }, [client]);

    return (
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
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-8 flex flex-col items-center">
                        <img src={`https://ui-avatars.com/api/?name=${client.name}&background=D62828&color=fff`} alt={client.name} className="mb-4 h-24 w-24 rounded-full border-2 border-brand-red" />
                        <h3 className="font-display text-2xl font-bold">{client.name}</h3>
                        <p className="text-white/50">{client.email}</p>

                        <div className="mt-6 flex gap-4">
                            <button className="flex items-center gap-2 rounded-full bg-brand-red px-6 py-2 font-bold text-white transition-transform hover:scale-105">
                                <MessageCircle size={18} /> Chat
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Metrics Chart */}
                        <div className="rounded-xl border border-white/10 bg-brand-black/50 p-4">
                            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">Weight History</h4>
                            <div className="h-[150px] w-full">
                                {metrics.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={metrics}>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <XAxis dataKey="date" hide />
                                            <Line
                                                type="monotone"
                                                dataKey="weight"
                                                stroke="#D62828"
                                                strokeWidth={3}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-xs text-white/30">
                                        No metrics recorded yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-brand-black/50 p-4">
                            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">Info</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/50">Joined</span>
                                    <span>{client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ClientDetail;
