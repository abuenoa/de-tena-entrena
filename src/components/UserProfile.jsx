import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Camera, User, Mail, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhotoURL(user.photoURL || '');
        }
    }, [user]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `users/${user.uid}/profile_${Date.now()}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            setPhotoURL(url);

            // Update Auth Profile
            if (user.uid) { // Ensure auth user is available
                // Note: updateProfile is on the User object from auth, but we might need to handle it via a wrapper if we want deep state update. 
                // However, useAuth updates state from onAuthStateChanged, so updating the backend should reflect eventually.
                // Actually, useAuth creates a merged object, passing the raw auth user might be needed or we update firestore and reload.
            }

            // Update Firestore
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { photoURL: url });

            // Ideally we'd also update the current User context state or force a reload, 
            // but the useAuth listener might pick it up if we trigger a token refresh or similar, 
            // or we just trust the local state for now.

        } catch (error) {
            console.error("Error uploading photo:", error);
            if (error.code === 'storage/unauthorized') {
                setMessage("Permission denied. check Firebase Storage rules.");
            } else if (error.code === 'storage/canceled') {
                setMessage("Upload canceled.");
            } else if (error.code === 'storage/unknown') {
                setMessage("Unknown error. Check if Storage is enabled in Firebase Console.");
            } else {
                setMessage(`Error uploading photo: ${error.message}`);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { name, photoURL });

            // Note: Updating display name in Auth is also good practice
            // await updateProfile(auth.currentUser, { displayName: name, photoURL });

            setMessage('Profile updated successfully');
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black p-6 text-white md:p-12">
            <div className="mx-auto max-w-2xl">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <h1 className="mb-8 font-display text-4xl font-bold">Your Profile</h1>

                <div className="rounded-3xl border border-white/10 bg-surface p-8">
                    <div className="mb-8 flex flex-col items-center">
                        <div className="relative group">
                            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-brand-red/20 bg-white/5">
                                {photoURL ? (
                                    <img src={photoURL} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white/20">
                                        {name ? name.substring(0, 2).toUpperCase() : 'LT'}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-brand-red p-2 text-white shadow-lg transition-transform hover:scale-110 active:scale-95">
                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                            </label>
                        </div>
                        <p className="mt-4 text-sm text-white/50">Click camera icon to change photo</p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                                <User size={16} /> Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-red focus:outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                                <Mail size={16} /> Email Address
                            </label>
                            <input
                                type="email"
                                value={user?.email}
                                disabled
                                className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/50"
                            />
                        </div>

                        {message && (
                            <p className={`text-center text-sm ${message.includes('Error') ? 'text-brand-red' : 'text-green-500'}`}>
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-bold text-brand-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
