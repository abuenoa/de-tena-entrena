import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Calendar, Star } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useTranslation } from 'react-i18next';

const AdminMetricsForm = ({ isOpen, onClose, client, metricToEdit, lastCheckIn, isBlueprint, onSuccess }) => {
    const { t } = useTranslation();
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);

    // Initial state for the 4 categories
    const initialCategoryState = { score: 1, note: '' };
    const [training, setTraining] = useState(initialCategoryState);
    const [nutrition, setNutrition] = useState(initialCategoryState);
    const [rest, setRest] = useState(initialCategoryState);
    const [neat, setNeat] = useState(initialCategoryState);

    useEffect(() => {
        if (metricToEdit) {
            // Populate form with existing data if editing
            const d = new Date(metricToEdit.date);
            setDate(d.toISOString().split('T')[0]);

            // Safety checks for existing data structure
            if (metricToEdit.training) setTraining(metricToEdit.training);
            if (metricToEdit.nutrition) setNutrition(metricToEdit.nutrition);
            if (metricToEdit.rest) setRest(metricToEdit.rest);
            if (metricToEdit.neat) setNeat(metricToEdit.neat);
        } else {
            // Reset form for new entry
            setDate(new Date().toISOString().split('T')[0]);

            if (lastCheckIn) {
                // Pre-fill from last check-in
                if (lastCheckIn.training) setTraining(lastCheckIn.training);
                if (lastCheckIn.nutrition) setNutrition(lastCheckIn.nutrition);
                if (lastCheckIn.rest) setRest(lastCheckIn.rest);
                if (lastCheckIn.neat) setNeat(lastCheckIn.neat);
            } else {
                setTraining(initialCategoryState);
                setNutrition(initialCategoryState);
                setRest(initialCategoryState);
                setNeat(initialCategoryState);
            }
        }
    }, [metricToEdit, isOpen, lastCheckIn, isBlueprint]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!date && !isBlueprint) || !client?.id) return;

        setLoading(true);
        try {
            const metricData = {
                type: 'daily_checkin',
                date: isBlueprint ? null : new Date(date).toISOString(),
                training: { ...training, score: parseInt(training.score) },
                nutrition: { ...nutrition, score: parseInt(nutrition.score) },
                rest: { ...rest, score: parseInt(rest.score) },
                neat: { ...neat, score: parseInt(neat.score) } // Using 'neat' for Activity
            };

            if (isBlueprint) {
                await setDoc(doc(db, `users/${client.id}/metrics`, 'blueprint'), metricData);
            } else if (metricToEdit) {
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
                    className="relative z-10 w-full max-w-6xl rounded-2xl border border-white/10 bg-surface p-6 shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-xl font-bold">
                            {isBlueprint ? t('metrics.edit_blueprint') : (metricToEdit ? 'Edit Check-in' : t('metrics.add_checkin'))}
                        </h2>
                        <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Date Picker (Hidden for Blueprint) */}
                        {!isBlueprint && (
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
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Training Section */}
                            <div className="space-y-3 rounded-xl border border-white/5 bg-white/5 p-4">
                                <h3 className="font-bold text-brand-red">{t('metrics.types.training')}</h3>
                                <ScoreInput
                                    label={t('metrics.score')}
                                    value={training.score}
                                    onChange={(val) => setTraining({ ...training, score: val })}
                                />
                                <NoteInput
                                    value={training.note}
                                    onChange={(val) => setTraining({ ...training, note: val })}
                                    placeholder={t('metrics.notes')}
                                />
                            </div>

                            {/* Nutrition Section */}
                            <div className="space-y-3 rounded-xl border border-white/5 bg-white/5 p-4">
                                <h3 className="font-bold text-green-500">{t('metrics.types.nutrition')}</h3>
                                <ScoreInput
                                    label={t('metrics.score')}
                                    value={nutrition.score}
                                    onChange={(val) => setNutrition({ ...nutrition, score: val })}
                                />
                                <NoteInput
                                    value={nutrition.note}
                                    onChange={(val) => setNutrition({ ...nutrition, note: val })}
                                    placeholder={t('metrics.notes')}
                                />
                            </div>

                            {/* Rest Section */}
                            <div className="space-y-3 rounded-xl border border-white/5 bg-white/5 p-4">
                                <h3 className="font-bold text-purple-500">{t('metrics.types.rest')}</h3>
                                <ScoreInput
                                    label={t('metrics.score')}
                                    value={rest.score}
                                    onChange={(val) => setRest({ ...rest, score: val })}
                                />
                                <NoteInput
                                    value={rest.note}
                                    onChange={(val) => setRest({ ...rest, note: val })}
                                    placeholder={t('metrics.notes')}
                                />
                            </div>

                            {/* NEAT Section */}
                            <div className="space-y-3 rounded-xl border border-white/5 bg-white/5 p-4">
                                <h3 className="font-bold text-blue-500">{t('metrics.types.neat')}</h3>
                                <ScoreInput
                                    label={t('metrics.score')}
                                    value={neat.score}
                                    onChange={(val) => setNeat({ ...neat, score: val })}
                                />
                                <NoteInput
                                    value={neat.note}
                                    onChange={(val) => setNeat({ ...neat, note: val })}
                                    placeholder={t('metrics.notes')}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? t('metrics.saving') : <><Save size={20} /> {isBlueprint || metricToEdit ? 'Update' : t('metrics.save')}</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// Helper components defined OUTSIDE the main component to prevent focus loss
const ScoreInput = ({ value, onChange, label }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase text-white/50">{label}</label>
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
                <button
                    key={num}
                    type="button"
                    onClick={() => onChange(num)}
                    className={`h-8 w-8 rounded-lg text-sm font-bold transition-colors ${value >= num ? 'bg-brand-red text-white' : 'bg-white/5 text-white/30 hover:bg-white/10'
                        }`}
                >
                    {num}
                </button>
            ))}
        </div>
    </div>
);

const NoteInput = ({ value, onChange, placeholder }) => (
    <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-red focus:outline-none transition-colors min-h-[140px] resize-none"
        placeholder={placeholder}
    />
);

export default AdminMetricsForm;
