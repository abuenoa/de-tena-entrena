import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

const MetricsModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [weight, setWeight] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!weight) return;

        setLoading(true);
        try {
            await addDoc(collection(db, `users/${user.uid}/metrics`), {
                weight: parseFloat(weight),
                date: new Date().toISOString()
            });
            onClose();
            setWeight('');
            // Ideally trigger a refresh of the chart here, but for now we'll rely on real-time listeners or reload
        } catch (error) {
            console.error("Error saving metrics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                    <h2 className="font-display text-xl font-bold">Update Metrics</h2>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Current Weight (kg)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-2xl font-bold text-center focus:border-brand-red focus:outline-none transition-colors"
                            placeholder="0.0"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Saving...' : <><Save size={20} /> Save Progress</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default MetricsModal;
