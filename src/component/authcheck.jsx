import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FirebaseContext } from "../context/firebasecontext";

const AuthCheck = () => {
    const {setUser} = useContext(FirebaseContext) ;
    const navigate = useNavigate();
    const location = useLocation();
    const [checkingAuth, setCheckingAuth] = useState(true); 

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // console.log("Auth State Changed auth_check" , user) ;
            setUser(user);
            setCheckingAuth(false); 

            if (user) {
                if (location.pathname === "/" || location.pathname === "/SignIn") { 
                    navigate("/Home");  
                }
            } else {
                if (location.pathname !== "/" && location.pathname !== "/SignIn") {
                    navigate("/");
                }
            }
        });

        return () => unsubscribe();
    }, [navigate, location]);

    if (checkingAuth) return <div className="bg-red-300 h-10 w-full flex justify-start pl-8 text-bold text-white items-center text-md font6 ">Loading...auth_check ⚠️</div>; // ✅ Prevent flickering before auth is checked

    return null;
};

export default AuthCheck;
