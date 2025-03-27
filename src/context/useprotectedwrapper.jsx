import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { FirebaseContext } from "../context/firebasecontext";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = () => {
    const { user, setUser } = useContext(FirebaseContext);
    const [checkingAuth, setCheckingAuth] = useState(true);

    if (!user) {
        return <Navigate to="/landingpage" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
