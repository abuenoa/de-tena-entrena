import { useState, createContext, useContext, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch additional user data (role, name) from Firestore
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            ...userDoc.data()
                        });
                    } else {
                        // Fallback if no firestore doc exists yet
                        console.warn('No user document found in Firestore');
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            role: 'client' // Default role or handle as error
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const register = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                role: 'client',
                createdAt: new Date().toISOString()
            });

            // Update local state immediately to avoid race conditions with onAuthStateChanged
            setUser({
                uid: user.uid,
                email,
                name,
                role: 'client'
            });

            return true;
        } catch (error) {
            console.error("Registration error:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
