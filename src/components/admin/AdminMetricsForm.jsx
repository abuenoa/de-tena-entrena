import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Calendar } from 'lucide-react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminMetricsForm = ({ isOpen, onClose, client, metricToEdit, onSuccess }) => {
    const [type, setType] = useState('weight');
    const [value, setValue] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (metricToEdit) {
            setType(metricToEdit.type || 'weight');
            setValue(metricToEdit.value || metricToEdit.weight); // fallback for backward compat
            setNotes(metricToEdit.notes || '');
            setNotes(metricToEdit.notes || '');
            // metricToEdit.date is expected to be a Date object or ISO string in the metric list
            // formatting to YYYY-MM-DD for input type="date"
            const d = new Date(metricToEdit.date);
            setDate(d.toISOString().split('T')[0]);
        } else {
            setType('weight');
            setValue('');
            setNotes('');
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, [metricToEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!value || !date || !client?.id) return;

        setLoading(true);
        try {
            const metricData = {
                type,
                value: parseFloat(value),
                weight: parseFloat(value), // Keep weight for backward compat if type is weight, or just store value
                notes,
                date: new Date(date).toISOString()
            };

            // Cleanup: if we move to 'value' generic, we might want to stop writing 'weight' explicitly unless it is weight.
            // For now, let's just write 'value' and 'type'. 'weight' field can be deprecated or kept in sync if type is weight.
            if (type === 'weight') metricData.weight = parseFloat(value);
            else delete metricData.weight;

            if (metricToEdit) {
                await updateDoc(doc(db, `users/${client.id}/metrics`, metricToEdit.id), metricData);
            } else {
                await addDoc(collection(db, `users/${client.id}/metrics`), metricData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving metrics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-6 shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-xl font-bold">
                            {metricToEdit ? 'Edit Metric' : 'Add Metric'}
                        </h2>
                        <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Metric Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-red focus:outline-none transition-colors appearance-none [&>option]:bg-[#2A2A2A]"
                                >
                                    <option value="weight">Weight (kg)</option>
                                    <option value="sleep">Sleep (hrs)</option>
                                    <option value="height">Height (cm)</option>
                                    <option value="nutrition">Nutrition (Score)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Value</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-2xl font-bold text-center focus:border-brand-red focus:outline-none transition-colors"
                                    placeholder="0.0"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Notes (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-red focus:outline-none transition-colors min-h-[80px]"
                                    placeholder="Add any context..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-white/30" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-brand-red focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? 'Saving...' : <><Save size={20} /> {metricToEdit ? 'Update' : 'Add'}</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AdminMetricsForm;
