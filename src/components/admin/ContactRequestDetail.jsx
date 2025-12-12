import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { X, Mail, Phone, Instagram, MapPin, Calendar, Clock, Heart, MoveRight, User, Eye, EyeOff } from 'lucide-react';

const ContactRequestDetail = ({ request, onClose }) => {
    const [currentStatus, setCurrentStatus] = useState(request.status || 'pending');
    const [updating, setUpdating] = useState(false);

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
            alert("Error updating status");
        } finally {
            setUpdating(false);
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
                        <h2 className="font-display text-xl font-bold">Request Details</h2>
                    </div>

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
                                <EyeOff size={14} /> Mark Unread
                            </>
                        ) : (
                            <>
                                <Eye size={14} /> Mark Viewed
                            </>
                        )}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
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
