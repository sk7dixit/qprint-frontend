import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [backendUser, setBackendUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setError(null);
            if (user) {
                setFirebaseUser(user);

                try {
                    const token = await user.getIdToken();
                    const res = await fetch(`/api/auth/profile/${user.uid}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setBackendUser(data);
                    } else {
                        console.error("Failed to fetch backend profile");
                        setBackendUser(null);
                        setError("Could not fetch user profile from server.");
                    }
                } catch (err) {
                    console.error("Error fetching backend profile:", err);
                    setBackendUser(null);
                    setError("Network error during profile sync.");
                }
            } else {
                setFirebaseUser(null);
                setBackendUser(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = async () => {
        await auth.signOut();
    };

    const user = backendUser ? { ...firebaseUser, ...backendUser } : firebaseUser;

    const value = {
        firebaseUser,
        backendUser,
        user,
        authenticated: !!firebaseUser,
        unauthenticated: !loading && !firebaseUser,
        loading,
        error,
        isError: !!error,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
