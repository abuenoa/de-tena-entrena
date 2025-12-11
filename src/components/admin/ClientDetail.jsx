import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, User, Calendar, TrendingUp, Plus, Edit2, Trash2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminMetricsForm from './AdminMetricsForm';

const ClientDetail = ({ client, onClose }) => {
    const [metrics, setMetrics] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [activeChartMetric, setActiveChartMetric] = useState('weight');

    const fetchMetrics = async () => {
        if (!client?.id) return;
        try {
            const q = query(collection(db, `users/${client.id}/metrics`), orderBy('date', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => {
                const d = doc.data();
                return {
                    id: doc.id,
                    ...d,
                    type: d.type || 'weight', // Default to weight for legacy
                    value: d.value || d.weight || 0, // Fallback
                    dateObj: new Date(d.date),
                    formattedDate: new Date(d.date).toLocaleDateString()
                };
            });
            setMetrics(data);
        } catch (error) {
            console.error("Error fetching metrics:", error);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, [client]);

    const handleDeleteMetric = async (metricId) => {
        if (window.confirm('Are you sure you want to delete this metric?')) {
            try {
                await deleteDoc(doc(db, `users/${client.id}/metrics`, metricId));
                fetchMetrics();
            } catch (error) {
                console.error("Error deleting metric:", error);
            }
        }
    };

    const handleEditMetric = (metric) => {
        setSelectedMetric(metric);
        setIsFormOpen(true);
    };

    const handleAddMetric = () => {
        setSelectedMetric(null);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        fetchMetrics();
    };

    // Filter and sort for chart
    const chartData = metrics
        .filter(m => m.type === activeChartMetric)
        .sort((a, b) => a.dateObj - b.dateObj)
        .map(m => ({
            date: m.formattedDate,
            val: m.value
        }));

    return (
        <>
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
                                <div className="mb-4 flex items-center justify-between">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-white/50">{activeChartMetric} History</h4>
                                    <select
                                        value={activeChartMetric}
                                        onChange={(e) => setActiveChartMetric(e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                                    >
                                        <option value="weight">Weight</option>
                                        <option value="sleep">Sleep</option>
                                        <option value="height">Height</option>
                                        <option value="nutrition">Nutrition</option>
                                    </select>
                                </div>
                                <div className="h-[150px] w-full">
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData}>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <XAxis dataKey="date" hide />
                                                <Line
                                                    type="monotone"
                                                    dataKey="val"
                                                    stroke="#D62828"
                                                    strokeWidth={3}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs text-white/30">
                                            No metrics recorded for this type.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Metrics Management List */}
                            <div className="rounded-xl border border-white/10 bg-brand-black/50 p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-white/50">Manage Metrics</h4>
                                    <button
                                        onClick={handleAddMetric}
                                        className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-xs font-bold text-brand-red hover:bg-white/10"
                                    >
                                        <Plus size={14} /> Add New
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {metrics.length > 0 ? (
                                        metrics.map((metric) => (
                                            <div key={metric.id} className="flex flex-col gap-2 rounded-lg border border-white/5 bg-white/5 p-3 px-4 transition-colors hover:bg-white/10">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${metric.type === 'weight' ? 'bg-blue-500/20 text-blue-500' :
                                                                metric.type === 'sleep' ? 'bg-purple-500/20 text-purple-500' :
                                                                    metric.type === 'nutrition' ? 'bg-green-500/20 text-green-500' :
                                                                        'bg-gray-500/20 text-gray-500'
                                                            }`}>
                                                            {metric.type}
                                                        </span>
                                                        <span className="text-sm font-bold">{metric.value}</span>
                                                        <span className="text-xs text-white/30">{metric.formattedDate}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEditMetric(metric)} className="text-white/30 hover:text-white">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button onClick={() => handleDeleteMetric(metric.id)} className="text-white/30 hover:text-brand-red">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {metric.notes && (
                                                    <p className="text-xs text-white/50 italic border-l-2 border-white/10 pl-2">
                                                        "{metric.notes}"
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-xs text-white/30 py-4">
                                            No explicit records found.
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

            <AdminMetricsForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                client={client}
                metricToEdit={selectedMetric}
                onSuccess={handleFormSuccess}
            />
        </>
    );
};

export default ClientDetail;
