import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Search, ChevronRight, Clock } from 'lucide-react';

const ContactRequestsList = ({ onSelectRequest }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const q = query(collection(db, 'contact_requests'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const requestsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRequests(requestsData);
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
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
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-surface p-6 transition-all hover:border-brand-red/50 hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{req.fullName}</h3>
                                <p className="text-sm text-white/50">{req.email}</p>
                            </div>
                            {req.status === 'pending' && (
                                <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase">
                                    New
                                </span>
                            )}
                        </div>

                        <div className="space-y-2 text-sm text-white/70 mb-4">
                            <p><span className="text-white/30">Goal:</span> <span className="line-clamp-1">{req.goal}</span></p>
                            <p><span className="text-white/30">Age:</span> {req.age}</p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-white/30 pt-4 border-t border-white/5">
                            <span className="flex items-center gap-1">
                                <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                            <span className="group-hover:text-brand-red transition-colors flex items-center gap-1">
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
