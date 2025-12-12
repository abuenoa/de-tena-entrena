import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Search, ChevronRight, Clock, Eye, EyeOff } from 'lucide-react';

const ContactRequestsList = ({ onSelectRequest }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'contact_requests'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requestsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(requestsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching requests:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div className="text-white/50">Loading requests...</div>;

    return (
        <div className="space-y-6">
            <header>
                <h1 className="font-display text-3xl font-bold">Contact Requests</h1>
                <p className="text-white/50">Review new athlete applications.</p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {requests.map((req) => (
                    <div
                        key={req.id}
                        onClick={() => onSelectRequest(req)}
                        className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-surface p-6 transition-all hover:-translate-y-1 ${req.status === 'pending'
                                ? 'border-brand-red/50 shadow-lg shadow-brand-red/5'
                                : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className={`font-bold text-lg ${req.status === 'pending' ? 'text-white' : 'text-white/70'}`}>
                                    {req.fullName}
                                </h3>
                                <p className="text-sm text-white/50">{req.email}</p>
                            </div>
                            {req.status === 'pending' ? (
                                <span className="px-2 py-1 rounded-full bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                    New
                                </span>
                            ) : (
                                <Eye size={16} className="text-white/20" />
                            )}
                        </div>

                        <div className="space-y-2 text-sm text-white/70 mb-4">
                            <p><span className="text-white/30">History:</span> <span className="line-clamp-1 italic">{req.history || 'N/A'}</span></p>
                            <p><span className="text-white/30">Location:</span> {req.community || 'N/A'}</p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-white/30 pt-4 border-t border-white/5">
                            <span className="flex items-center gap-1">
                                <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`transition-colors flex items-center gap-1 ${req.status === 'pending' ? 'text-brand-red group-hover:text-white' : 'group-hover:text-brand-red'}`}>
                                View Details <ChevronRight size={12} />
                            </span>
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <div className="col-span-full p-8 text-center text-white/50 border border-white/10 rounded-2xl border-dashed">
                        No new requests.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactRequestsList;
