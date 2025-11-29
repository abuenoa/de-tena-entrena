import { useState, createContext, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        // Simulated auth logic
        if (email === 'admin@detena.com' && password === 'admin') {
            setUser({ email, role: 'admin', name: 'David de Tena' });
            return true;
        }
        if (email === 'client@detena.com' && password === 'client') {
            setUser({ email, role: 'client', name: 'Client User' });
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
