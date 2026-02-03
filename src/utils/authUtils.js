import { initializeApp, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, firebaseConfig } from '../firebase';

/**
 * Creates a new client user in Firebase Auth and Firestore.
 * Uses a secondary Firebase app instance to avoid logging out the current admin.
 * 
 * @param {string} name - Full name of the client
 * @param {string} email - Email address of the client
 * @param {string} password - Password for the new account
 * @returns {Promise<Object>} The created user object
 */
export const createClientUser = async (name, email, password) => {
    const secondaryAppName = "secondaryAppForUserCreation";
    let secondaryApp;

    try {
        secondaryApp = getApp(secondaryAppName);
    } catch (e) {
        secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
    }

    const secondaryAuth = getAuth(secondaryApp);

    // Create the user in the secondary app
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const newUser = userCredential.user;

    // Write to Firestore using the PRIMARY app's db instance (authenticated as admin)
    await setDoc(doc(db, 'users', newUser.uid), {
        name,
        email,
        role: 'client',
        createdAt: new Date().toISOString(),
        photoURL: ''
    });

    // Sign out from the secondary app to clean up
    await signOut(secondaryAuth);

    return newUser;
};
