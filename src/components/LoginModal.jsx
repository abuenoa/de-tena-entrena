import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const success = login(email, password);
        if (success) {
            onClose();
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/80 backdrop-blur-md"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-surface p-8 shadow-2xl"
                        >
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-white/50 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-8 text-center">
                                <h2 className="font-display text-3xl font-bold text-white">Access</h2>
                                <p className="text-sm text-white/50">Enter your credentials to continue</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Mail className="absolute left-0 top-3 h-5 w-5 text-white/30" />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border-b border-white/10 bg-transparent py-3 pl-8 text-white placeholder-white/30 focus:border-brand-red focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="relative">
                                        <Lock className="absolute left-0 top-3 h-5 w-5 text-white/30" />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full border-b border-white/10 bg-transparent py-3 pl-8 text-white placeholder-white/30 focus:border-brand-red focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-center text-sm text-brand-red">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full rounded-full bg-white py-3 font-bold text-brand-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    ENTER
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
