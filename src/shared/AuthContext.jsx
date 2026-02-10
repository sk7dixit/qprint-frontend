import { createContext, useContext, useEffect, useState } from "react";
import { listenToAuthChanges } from "./authListener";
import { auth } from "./firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [shop, setShop] = useState(null);
    const [authState, setAuthState] = useState("loading"); // loading | authenticated | unauthenticated

    const syncWithBackend = async (uid, token) => {
        try {
            // Use the Google auth endpoint to sync user existence and get profile status
            const response = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("INTERNAL DEBUG: Backend Sync User:", data.user);
                return data.user;
            }
        } catch (e) {
            console.error("Failed to sync with backend:", e);
        }
        return null;
    };

    const refreshUser = async () => {
        if (!auth.currentUser) return;
        try {
            const tokenResult = await auth.currentUser.getIdTokenResult(true);
            const backendUser = await syncWithBackend(auth.currentUser.uid, tokenResult.token);

            if (backendUser) {
                // Merge Firebase auth data with Backend Postgres data
                setUser({
                    uid: auth.currentUser.uid,
                    email: auth.currentUser.email,
                    name: auth.currentUser.displayName,
                    ...backendUser, // This includes role, profile_complete, etc.
                    token: tokenResult.token
                });

                // If shopkeeper, fetch shop data separately if needed, or rely on backendUser if it includes it
                if (backendUser.role === 'seller' && backendUser.id) {
                    // specific shop fetch if needed, otherwise backendUser might suffice
                    // keeping original logic structure if shop data was distinct
                }
            }
        } catch (e) {
            console.error("Failed to refresh user profile:", e);
        }
    };

    useEffect(() => {
        const unsub = listenToAuthChanges(async (u) => {
            if (u) {
                const backendUser = await syncWithBackend(u.uid, u.token);
                if (backendUser) {
                    setUser({
                        ...u,
                        ...backendUser
                    });
                } else {
                    // Fallback to just firebase data if backend fails, but this is risky for the profile_complete check
                    console.warn("Backend sync failed, using Firebase data only");
                    setUser(u);
                }
                setAuthState("authenticated");
            } else {
                setUser(null);
                setShop(null);
                setAuthState("unauthenticated");
            }
        });
        return unsub;
    }, []);

    const logout = async () => {
        const { signOut } = await import("firebase/auth");
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            shop,
            setUser,
            loading: authState === "loading",
            authenticated: authState === "authenticated",
            unauthenticated: authState === "unauthenticated",
            authState,
            refreshUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
