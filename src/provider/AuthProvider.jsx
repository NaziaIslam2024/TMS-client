import { createContext, useEffect, useState } from "react";
import { getAuth,  GoogleAuthProvider,  onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { app } from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();

    const googleSignIn = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }

    const logout = () => {
        setLoading(true);
        return signOut(auth);
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Currently loggedin user : ", currentUser);
            setUser(currentUser);
            setLoading(false);
        })

        return () => {
            unSubscribe();
        }
    
    }, [])

    const authInfo = { user, loading, googleSignIn, logout}
    
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;