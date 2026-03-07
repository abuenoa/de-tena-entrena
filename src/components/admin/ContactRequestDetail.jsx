import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { X, Mail, Phone, Instagram, MapPin, Calendar, Clock, Heart, MoveRight, User, Eye, EyeOff, Trash2, CheckCircle, Lock, Loader2 } from 'lucide-react';
import { createClientUser } from '../../utils/authUtils';

const ContactRequestDetail = ({ request, onClose, onViewClient }) => {
    const { t } = useTranslation();
    const [currentStatus, setCurrentStatus] = useState(request.status || 'pending');
    const [updating, setUpdating] = useState(false);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [accepting, setAccepting] = useState(false);

    const toggleStatus = async () => {
        if (updating) return;
        setUpdating(true);
        const newStatus = currentStatus === 'viewed' ? 'pending' : 'viewed';

        try {
            setCurrentStatus(newStatus); // Optimistic update
            const requestRef = doc(db, 'contact_requests', request.id);
            await updateDoc(requestRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
            setCurrentStatus(currentStatus); // Revert
            alert(t('admin.status_error'));
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        setUpdating(true);
        try {
            await deleteDoc(doc(db, 'contact_requests', request.id));
            window.dispatchEvent(new Event('requestDeleted'));
            onClose(); // Close modal on success
        } catch (error) {
            console.error("Error deleting document:", error);
            alert(t('admin.delete_error'));
        } finally {
            setUpdating(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleAccept = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            alert(t('auth.password_label') + ": " + t('auth.password_min_length', 'Min. 6 characters'));
            return;
        }

        setAccepting(true);
        try {
            // 1. Create the user
            const newUser = await createClientUser(request.fullName, request.email, password);

            // 2. Update the request status
            const requestRef = doc(db, 'contact_requests', request.id);
            await updateDoc(requestRef, {
                status: 'accepted',
                clientId: newUser.uid
            });

            setCurrentStatus('accepted');
            setShowPasswordPrompt(false);
            alert(t('admin.accept_success'));
        } catch (error) {
            console.error("Error accepting request:", error);
            alert(t('admin.accept_error') + ": " + error.message);
        } finally {
            setAccepting(false);
        }
    };

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
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10">
                            <X size={20} />
                        </button>
                        <h2 className="font-display text-xl font-bold">{t('admin.requests')}</h2>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={toggleStatus}
                            disabled={updating}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${currentStatus === 'viewed'
                                ? 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                : 'bg-brand-red text-white shadow-lg shadow-brand-red/20 hover:bg-red-600'
                                }`}
                        >
                            {currentStatus === 'viewed' ? (
                                <>
                                    <EyeOff size={14} /> {t('admin.mark_unread')}
                                </>
                            ) : (
                                <>
                                    <Eye size={14} /> {t('admin.mark_viewed')}
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={updating || accepting}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all bg-white/5 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                        >
                            <Trash2 size={14} /> {t('admin.delete_request')}
                        </button>

                        {currentStatus !== 'accepted' ? (
                            <button
                                onClick={() => setShowPasswordPrompt(!showPasswordPrompt)}
                                disabled={updating || accepting}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white"
                            >
                                <CheckCircle size={14} /> {t('admin.accept_request')}
                            </button>
                        ) : (
                            <button
                                onClick={() => onViewClient(request.clientId, request.email)}
                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                                title={t('admin.view_client_profile', 'View client profile')}
                            >
                                <CheckCircle size={14} /> {t('admin.accepted')}
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Delete Confirmation Prompt */}
                    {showDeleteConfirm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 rounded-2xl bg-brand-red/10 border border-brand-red space-y-4"
                        >
                            <div className="flex items-center gap-2 text-brand-red">
                                <Trash2 size={18} />
                                <h4 className="font-bold">{t('admin.delete_request')}</h4>
                            </div>
                            <p className="text-sm text-white/80">{t('admin.delete_confirm', '¿Seguro que quieres borrar esta solicitud? Esta acción no se puede deshacer.')}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDelete}
                                    disabled={updating}
                                    className="flex-1 bg-brand-red text-white py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors flex justify-center items-center"
                                >
                                    {updating ? <Loader2 size={18} className="animate-spin" /> : t('admin.delete_request')}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={updating}
                                    className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-sm transition-colors text-white"
                                >
                                    {t('common.cancel', 'Cancelar')}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Password Prompt for Acceptance */}
                    {showPasswordPrompt && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 rounded-2xl bg-brand-red/5 border border-brand-red/20 space-y-4"
                        >
                            <div className="flex items-center gap-2 text-brand-red">
                                <Lock size={18} />
                                <h4 className="font-bold">{t('admin.enter_password')}</h4>
                            </div>
                            <form onSubmit={handleAccept} className="space-y-3">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('admin.password_placeholder')}
                                    className="w-full rounded-xl border border-white/10 bg-brand-black/50 py-3 px-4 text-white focus:border-brand-red focus:outline-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={accepting}
                                        className="flex-1 bg-brand-red text-white py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                                    >
                                        {accepting ? <Loader2 size={18} className="animate-spin mx-auto" /> : t('admin.accept_request')}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={accepting}
                                        onClick={() => setShowPasswordPrompt(false)}
                                        className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-sm"
                                    >
                                        {t('common.cancel', 'Cancel')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* Header Info */}
                    <div>
                        <h3 className="font-display text-2xl font-bold mb-1">{request.fullName}</h3>
                        <div className="flex items-center gap-2 text-white/50 text-sm">
                            <Clock size={14} />
                            <span>Submitted on {new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Quick Contact Actions */}
                    <div className="flex gap-3 flex-wrap">
                        <a href={`mailto:${request.email}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors border border-white/5 hover:border-white/20">
                            <Mail size={16} className="text-brand-red" /> {request.email}
                        </a>
                        <a href={`tel:${request.phone}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors border border-white/5 hover:border-white/20">
                            <Phone size={16} className="text-brand-red" /> {request.phone}
                        </a>
                        {request.instagram && (
                            <a href={`https://instagram.com/${request.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors border border-white/5 hover:border-white/20">
                                <Instagram size={16} className="text-brand-red" /> {request.instagram}
                            </a>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Personal & Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-brand-black/50 border border-white/10">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-2">
                                    <Calendar size={14} /> Date of Birth
                                </h4>
                                <p className="font-bold">{request.dob ? new Date(request.dob).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-brand-black/50 border border-white/10">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-2">
                                    <MapPin size={14} /> Location
                                </h4>
                                <p className="font-bold">{request.community || 'N/A'}</p>
                                <p className="text-sm text-white/70">{request.province}</p>
                            </div>
                        </div>

                        {/* Long Text Fields */}
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-red mb-3">Sports History</h4>
                                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{request.history || 'No history provided.'}</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-red mb-3">Motivation</h4>
                                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{request.motivation || 'No motivation provided.'}</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-red mb-3 flex items-center gap-2">
                                    <Heart size={14} /> Injuries / Conditions
                                </h4>
                                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{request.injury || 'None reported.'}</p>
                            </div>

                            {request.extras && (
                                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-red mb-3">Extra Info</h4>
                                    <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{request.extras}</p>
                                </div>
                            )}

                            {request.referral && (
                                <div className="px-4 py-3 rounded-xl bg-brand-red/10 border border-brand-red/20 inline-block">
                                    <span className="text-xs font-bold uppercase tracking-wider text-brand-red/80 mr-2">Referral:</span>
                                    <span className="font-medium text-brand-red">{request.referral}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactRequestDetail;
