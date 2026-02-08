import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export const listenToAuthChanges = (setUser) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
            setUser(null);
            return;
        }

        const tokenResult = await firebaseUser.getIdTokenResult();
        const token = tokenResult.token;

        setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            role: tokenResult.claims.role?.toLowerCase(),
            shopId: tokenResult.claims.shopId,
            token,
        });
    });
};
