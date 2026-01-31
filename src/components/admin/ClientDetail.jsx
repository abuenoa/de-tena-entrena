import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, User, Calendar, TrendingUp, Plus, Edit2, Trash2, ChevronDown, List, Star, FileText } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { collection, query, orderBy, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminMetricsForm from './AdminMetricsForm';
import { useTranslation } from 'react-i18next';

const ClientDetail = ({ client, onClose }) => {
    const { t } = useTranslation();
    const [metrics, setMetrics] = useState([]);
    const [blueprint, setBlueprint] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [isBlueprintMode, setIsBlueprintMode] = useState(false);
    const [activeChartMetric, setActiveChartMetric] = useState('average');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchMetrics = async () => {
        if (!client?.id) return;
        try {
            const q = query(collection(db, `users/${client.id}/metrics`), orderBy('date', 'asc')); // Ascending for chart logic
            const snapshot = await getDocs(q);
            const data = snapshot.docs
                .map(doc => {
                    const d = doc.data();
                    if (d.type !== 'daily_checkin') return null; // Filter logic: only accept new format

                    // Calculate average
                    const avg = ((d.training?.score || 0) + (d.nutrition?.score || 0) + (d.rest?.score || 0) + (d.neat?.score || 0)) / 4;

                    return {
                        id: doc.id,
                        ...d,
                        average: avg,
                        dateObj: new Date(d.date),
                        formattedDate: new Date(d.date).toLocaleDateString()
                    };
                })
                .filter(Boolean)
                .sort((a, b) => b.dateObj - a.dateObj); // Sort descending for list view (newest first)

            setMetrics(data);

            // Fetch Blueprint
            // Fetch Blueprint
            const blueprintDoc = await getDoc(doc(db, `users/${client.id}/metrics`, 'blueprint'));
            if (blueprintDoc.exists()) {
                const bd = blueprintDoc.data();
                const avg = ((bd.training?.score || 0) + (bd.nutrition?.score || 0) + (bd.rest?.score || 0) + (bd.neat?.score || 0)) / 4;
                setBlueprint({ id: 'blueprint', ...bd, average: avg });
            } else {
                setBlueprint(null);
            }
        } catch (error) {
            console.error("Error fetching metrics:", error);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, [client]);

    const handleDeleteMetric = async (metricId) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
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
        setIsBlueprintMode(false);
        setIsFormOpen(true);
    };

    const handleEditBlueprint = () => {
        setSelectedMetric(blueprint);
        setIsBlueprintMode(true);
        setIsFormOpen(true);
    };

    const handleAddMetric = () => {
        setSelectedMetric(null);
        setIsBlueprintMode(false);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        fetchMetrics();
    };

    // Prepare chart data (needs to be ascending order)
    const chartData = [...metrics].sort((a, b) => a.dateObj - b.dateObj).map(m => {
        let val = 0;
        switch (activeChartMetric) {
            case 'average': val = m.average; break;
            case 'training': val = m.training?.score || 0; break;
            case 'nutrition': val = m.nutrition?.score || 0; break;
            case 'rest': val = m.rest?.score || 0; break;
            case 'neat': val = m.neat?.score || 0; break;
            default: val = 0;
        }
        return {
            date: m.formattedDate,
            val: parseFloat(val.toFixed(1))
        };
    });

    // Helper to render stars
    const renderStars = (score) => {
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${i < score ? 'bg-white' : 'bg-white/10'}`}
                    />
                ))}
            </div>
        );
    };

    const metricTypes = ['average', 'training', 'nutrition', 'rest', 'neat'];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMetrics = metrics.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(metrics.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 z-50 h-full w-full max-w-[95vw] border-l border-white/10 bg-surface shadow-2xl"
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 p-6 bg-brand-black sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <h2 className="font-display text-xl font-bold">Client Details</h2>
                            <div className="h-6 w-px bg-white/10"></div>
                            <div className="flex items-center gap-3">
                                <img src={`https://ui-avatars.com/api/?name=${client.name}&background=D62828&color=fff`} alt={client.name} className="h-8 w-8 rounded-full border border-white/10" />
                                <span className="font-bold text-white/70">{client.name}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-[#121212]">
                        <div className="mx-auto max-w-7xl space-y-8">

                            {/* Blueprint (Main Notes) Section */}
                            <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <FileText size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-brand-red/10">
                                                <FileText className="text-brand-red" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-white">{t('metrics.main_notes')}</h4>
                                                <p className="text-xs text-white/50">{t('metrics.blueprint_desc')}</p>
                                            </div>
                                            {blueprint && (
                                                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-white/50 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 ml-2">
                                                    <span>{t('metrics.types.average')}:</span>
                                                    <span className={`text-sm font-bold ${blueprint.average >= 4 ? 'text-green-500' :
                                                        blueprint.average >= 2.5 ? 'text-yellow-500' : 'text-red-500'
                                                        }`}>{blueprint.average.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleEditBlueprint}
                                            className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 border border-white/10 transition-colors"
                                        >
                                            <Edit2 size={16} /> {t('metrics.edit_blueprint')}
                                        </button>
                                    </div>

                                    {blueprint ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5 bg-white/[0.02] rounded-xl border border-white/5">
                                            {/* Blueprint Categories */}
                                            {['training', 'nutrition', 'rest', 'neat'].map((type) => (
                                                <div key={type} className="p-4 space-y-2">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-xs font-bold uppercase tracking-wider ${type === 'training' ? 'text-brand-red' :
                                                            type === 'nutrition' ? 'text-green-500' :
                                                                type === 'rest' ? 'text-purple-500' : 'text-blue-500'
                                                            }`}>{t(`metrics.types.${type}`)}</span>
                                                        <span className="font-mono text-sm font-bold">{blueprint[type]?.score}/5</span>
                                                    </div>
                                                    {renderStars(blueprint[type]?.score)}
                                                    {blueprint[type]?.note && (
                                                        <p className="text-sm text-white/80 leading-relaxed mt-3 whitespace-pre-wrap">
                                                            {blueprint[type]?.note}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-white/30 border border-dashed border-white/10 rounded-xl">
                                            <p>No Main Notes defined yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Chart Section */}
                            <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6 shadow-lg">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-white/5">
                                            <TrendingUp className="text-brand-red" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold">{t('metrics.progress_history')}</h4>
                                            <p className="text-xs text-white/50">{t('metrics.progress_desc')}</p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 focus:outline-none border border-white/10"
                                        >
                                            <span className="capitalize">{t(`metrics.types.${activeChartMetric}`) || activeChartMetric}</span>
                                            <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute right-0 top-full mt-2 z-50 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#1A1A1A] py-1 shadow-black/50 shadow-2xl backdrop-blur-xl">
                                                {metricTypes.map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => {
                                                            setActiveChartMetric(type);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-white/5 flex items-center gap-3 ${activeChartMetric === type ? 'text-brand-red font-bold bg-white/5' : 'text-white/70'}`}
                                                    >
                                                        <div className={`w-2 h-2 rounded-full ${type === 'average' ? 'bg-white' :
                                                            type === 'training' ? 'bg-brand-red' :
                                                                type === 'nutrition' ? 'bg-green-500' :
                                                                    type === 'rest' ? 'bg-purple-500' : 'bg-blue-500'
                                                            }`} />
                                                        {t(`metrics.types.${type}`)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="h-[180px] w-full">
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                                    labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}
                                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                                                />
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="rgba(255,255,255,0.2)"
                                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="val"
                                                    stroke="#D62828"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#D62828', strokeWidth: 2, r: 4, stroke: '#1A1A1A' }}
                                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center text-white/30 gap-4">
                                            <TrendingUp size={48} strokeWidth={1} />
                                            <p>No enough data to display chart.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* History List */}
                            <div>
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-white/5">
                                            <List className="text-brand-red" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold">{t('metrics.detailed_history')}</h4>
                                            <p className="text-xs text-white/50">{t('metrics.history_desc')}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddMetric}
                                        className="flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white hover:bg-red-700 shadow-lg shadow-red-900/20 transition-all hover:scale-105"
                                    >
                                        <Plus size={16} /> {t('metrics.add_checkin')}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {currentMetrics.length > 0 ? (
                                        currentMetrics.map((metric) => (
                                            <div key={metric.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#1A1A1A] transition-all hover:border-white/10 hover:shadow-xl hover:shadow-black/50">
                                                {/* Card Header: Date & Controls */}
                                                <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-4">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar size={16} className="text-white/30" />
                                                        <span className="font-bold text-white">{metric.formattedDate}</span>
                                                        <div className="h-4 w-px bg-white/10"></div>
                                                        <div className="flex items-center gap-2 text-xs font-medium text-white/50 px-2 py-1 rounded-full bg-white/5 border border-white/5">
                                                            <span>{t('metrics.types.average')}:</span>
                                                            <span className={`text-sm font-bold ${metric.average >= 4 ? 'text-green-500' :
                                                                metric.average >= 2.5 ? 'text-yellow-500' : 'text-red-500'
                                                                }`}>{metric.average.toFixed(1)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <button onClick={() => handleEditMetric(metric)} className="p-2 text-white/30 hover:text-white transition-colors bg-white/5 rounded-lg hover:bg-white/10">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button onClick={() => handleDeleteMetric(metric.id)} className="p-2 text-white/30 hover:text-brand-red transition-colors bg-white/5 rounded-lg hover:bg-white/10">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Card Body: The 4 Categories Grid */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
                                                    {/* Training */}
                                                    <div className="p-4 space-y-2">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-bold uppercase tracking-wider text-brand-red">{t('metrics.types.training')}</span>
                                                            <span className="font-mono text-sm font-bold">{metric.training?.score}/5</span>
                                                        </div>
                                                        {renderStars(metric.training?.score)}
                                                        {metric.training?.note && (
                                                            <p className="text-xs text-white/60 leading-relaxed mt-2 border-l-2 border-brand-red/20 pl-2 line-clamp-[8] hover:line-clamp-none transition-all whitespace-pre-wrap">
                                                                {metric.training?.note}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Nutrition */}
                                                    <div className="p-4 space-y-2">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-bold uppercase tracking-wider text-green-500">{t('metrics.types.nutrition')}</span>
                                                            <span className="font-mono text-sm font-bold">{metric.nutrition?.score}/5</span>
                                                        </div>
                                                        {renderStars(metric.nutrition?.score)}
                                                        {metric.nutrition?.note && (
                                                            <p className="text-xs text-white/60 leading-relaxed mt-2 border-l-2 border-green-500/20 pl-2 line-clamp-[8] hover:line-clamp-none transition-all whitespace-pre-wrap">
                                                                {metric.nutrition?.note}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Rest */}
                                                    <div className="p-4 space-y-2">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-bold uppercase tracking-wider text-purple-500">{t('metrics.types.rest')}</span>
                                                            <span className="font-mono text-sm font-bold">{metric.rest?.score}/5</span>
                                                        </div>
                                                        {renderStars(metric.rest?.score)}
                                                        {metric.rest?.note && (
                                                            <p className="text-xs text-white/60 leading-relaxed mt-2 border-l-2 border-purple-500/20 pl-2 line-clamp-[8] hover:line-clamp-none transition-all whitespace-pre-wrap">
                                                                {metric.rest?.note}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* NEAT */}
                                                    <div className="p-4 space-y-2">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-bold uppercase tracking-wider text-blue-500">{t('metrics.types.neat')}</span>
                                                            <span className="font-mono text-sm font-bold">{metric.neat?.score}/5</span>
                                                        </div>
                                                        {renderStars(metric.neat?.score)}
                                                        {metric.neat?.note && (
                                                            <p className="text-xs text-white/60 leading-relaxed mt-2 border-l-2 border-blue-500/20 pl-2 line-clamp-[8] hover:line-clamp-none transition-all whitespace-pre-wrap">
                                                                {metric.neat?.note}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-white/30 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                                            <Calendar size={32} className="mb-2 opacity-50" />
                                            <p>No check-ins recorded yet.</p>
                                            <p className="text-xs">Click "New Entry" to add the first daily log.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {metrics.length > itemsPerPage && (
                                    <div className="flex justify-center items-center gap-4 mt-8">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm font-medium text-white/50">
                                            Page <span className="text-white">{currentPage}</span> of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
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
                lastCheckIn={blueprint}
                isBlueprint={isBlueprintMode}
                onSuccess={handleFormSuccess}
            />
        </>
    );
};

export default ClientDetail;
