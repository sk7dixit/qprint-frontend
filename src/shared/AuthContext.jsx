import { createContext, useContext, useEffect, useState } from "react";
import { listenToAuthChanges } from "./authListener";
import { auth } from "./firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [shop, setShop] = useState(null);
    const [authState, setAuthState] = useState("loading"); // loading | authenticated | unauthenticated | error
    const [error, setError] = useState(null);

    // Timeout guard for loading state
    useEffect(() => {
        let timeout;
        if (authState === "loading") {
            timeout = setTimeout(() => {
                console.error("⛔ Auth loading timed out after 10s");
                setAuthState("error");
                setError("Login is taking too long. Please refresh the page.");
            }, 10000); // 10s timeout
        }
        return () => clearTimeout(timeout);
    }, [authState]);

    const syncWithBackend = async (uid, token) => {
        try {
            const response = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', token); // Persist for reliability across reload/standalone axios
                return data.user;
            } else {
                const errData = await response.json().catch(() => ({}));
                console.error("❌ Backend sync failed with status:", response.status, errData);
                throw new Error(errData.error || "Backend synchronization failed");
            }
        } catch (e) {
            console.error("❌ Failed to sync with backend:", e.message);
            throw e;
        }
    };

    const refreshUser = async () => {
        if (!auth.currentUser) return;
        try {
            const tokenResult = await auth.currentUser.getIdTokenResult(true);
            const backendUser = await syncWithBackend(auth.currentUser.uid, tokenResult.token);

            if (backendUser) {
                setUser({
                    uid: auth.currentUser.uid,
                    email: auth.currentUser.email,
                    name: auth.currentUser.displayName,
                    ...backendUser,
                    isProfileComplete: backendUser.is_profile_complete,
                    token: tokenResult.token
                });
            }
        } catch (e) {
            console.error("Failed to refresh user profile:", e);
        }
    };

    useEffect(() => {
        const unsub = listenToAuthChanges(async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const backendUser = await syncWithBackend(firebaseUser.uid, firebaseUser.token);

                    if (backendUser) {
                        setUser({
                            ...firebaseUser,
                            ...backendUser,
                            isProfileComplete: backendUser.is_profile_complete
                        });
                        setAuthState("authenticated");
                    } else {
                        throw new Error("No user data returned from backend");
                    }
                } catch (err) {
                    console.error("⛔ Redirecting to error state due to sync failure");
                    setUser(null);
                    setAuthState("error");
                    setError(err.message || "Could not connect to authentication server.");
                }
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
            localStorage.removeItem('token');
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
            isError: authState === "error",
            error,
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
