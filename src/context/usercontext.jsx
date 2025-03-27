import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getAuth , setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { FirebaseContext } from "./firebasecontext";

const UserContext = createContext();
export const UserProvider = ({ children }) => {

  const auth = getAuth();
  const [userdetails, setuserdetails] = useState(null);
  const {user , setUser} = useContext(FirebaseContext);

  const [loading, setLoading] = useState(true);
  
  // setpersistance and onAuthStateChanged from firebase functions
    useEffect(() => {
      setPersistence(auth, browserLocalPersistence).then(() => console.log("Persistence: set to local")).catch(error => console.error("Error setting persistence:", error));
  
      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
          setUser(authUser);
          setLoading(false);
      });
  
      return () => unsubscribe(); 
  }, []);

    useEffect(() => {
      if (!user) {
        return;
      }
      const fetchUser = async () => {
      const token = await auth.currentUser.getIdToken(); 
        if (!token) {
          return;
        }
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/userdetail`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setuserdetails(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUser();
    }, [user]);

  return (
    <UserContext.Provider value={{ userdetails, setuserdetails ,loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);