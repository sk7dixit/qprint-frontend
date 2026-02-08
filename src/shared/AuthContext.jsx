import { createContext, useContext, useEffect, useState } from "react";
import { listenToAuthChanges } from "./authListener";
import { auth } from "./firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        if (!user) return;
        try {
            const token = await auth.currentUser?.getIdToken(true);
            const response = await fetch(`/api/auth/profile/${user.uid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const profile = await response.json();
                setUser(prev => ({ ...prev, ...profile, token }));
            }
        } catch (e) {
            console.error("Failed to refresh user profile:", e);
        }
    };

    useEffect(() => {
        const unsub = listenToAuthChanges(async (u) => {
            if (u) {
                try {
                    // Sync profile_complete status from backend
                    const response = await fetch(`/api/auth/profile/${u.uid}`, {
                        headers: { Authorization: `Bearer ${u.token}` }
                    });
                    if (response.ok) {
                        const profile = await response.json();
                        setUser({ ...u, ...profile });
                    } else {
                        setUser(u);
                    }
                } catch (e) {
                    setUser(u);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsub;
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
