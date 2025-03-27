import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup , signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);
export const FirebaseContext = createContext(null);


const FirebaseProvider = ({ children }) => {

    provider.setCustomParameters({
        prompt: "select_account",
      });

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    
    const signupWithEmailPassword = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential ;
        } catch (error) {
            console.error("Signup error:", error.message);
        }
    };

    const signinWithemailpassword = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("SignIn error:", error.message);
            throw error;
        }
    };

    //google signin handler main function
    const signinwithgoogle = async () => {
        try{
            const userCredential = await signInWithPopup(auth , provider);
            return userCredential;
        }
        catch(error){
            throw error ;
        }
    }

    return (
        <FirebaseContext.Provider value={{user , setUser , signupWithEmailPassword , signinWithemailpassword , signinwithgoogle }}>
            {children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseProvider;
