import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createClientUser } from '../../utils/authUtils';

const CreateClientModal = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await createClientUser(name, email, password);
            setLoading(false);
            if (onSuccess) onSuccess();
            onClose();
            setName('');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error("Error creating client:", err);
            setError(err.message || "Failed to create client");
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-brand-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-surface p-8 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-white/50 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8 text-center">
                            <h2 className="font-display text-2xl font-bold text-white">Create New Client</h2>
                            <p className="text-sm text-white/50">Add a new user to the platform.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-white/30" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 text-white focus:border-brand-red focus:outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-white/30" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 text-white focus:border-brand-red focus:outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-white/30" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 text-white focus:border-brand-red focus:outline-none"
                                        placeholder="Min. 6 characters"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-center text-sm text-brand-red">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red py-3 font-bold text-white transition-colors hover:bg-red-700"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Create Account'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateClientModal;
