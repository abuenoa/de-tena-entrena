import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Phone, Instagram } from 'lucide-react';

const ContactRequestDetail = ({ request, onClose }) => {
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
                    <h2 className="font-display text-xl font-bold">Request Details</h2>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div>
                        <h3 className="font-display text-2xl font-bold mb-1">{request.fullName}</h3>
                        <p className="text-white/50 text-sm">Submitted on {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex gap-4 flex-wrap">
                        <a href={`mailto:${request.email}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors">
                            <Mail size={16} /> {request.email}
                        </a>
                        <a href={`tel:${request.phone}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors">
                            <Phone size={16} /> {request.phone}
                        </a>
                        {request.instagram && (
                            <a href={`https://instagram.com/${request.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors">
                                <Instagram size={16} /> {request.instagram}
                            </a>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-brand-black/50 border border-white/10">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Primary Goal</h4>
                            <p className="text-lg">{request.goal}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-brand-black/50 border border-white/10">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Age</h4>
                                <p className="font-bold">{request.age}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-brand-black/50 border border-white/10">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Commitment</h4>
                                <p className="font-bold">{request.commitment} days/week</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-brand-black/50 border border-white/10">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Experience</h4>
                            <p className="capitalize">{request.experience}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-brand-black/50 border border-white/10">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Injuries</h4>
                            <p>{request.injuries || "None reported."}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactRequestDetail;
