import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import MetricsDashboard from '../shared/MetricsDashboard';

const ClientDetail = ({ client, onClose }) => {
    return (
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
                    <div className="mx-auto max-w-7xl">
                        <MetricsDashboard client={client} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ClientDetail;
