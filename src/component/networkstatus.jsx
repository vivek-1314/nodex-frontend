import { useState, useEffect } from "react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnect, setShowReconnect] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
        setShowReconnect(true); 
        setIsOnline(true); 
        setTimeout(() => {
          setShowReconnect(false);
        }, 8000);
      };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <>
      {!isOnline && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center text-white text-xl z-50">
          No internet connection. Please check your network.
        </div>
      )}

      {showReconnect && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center p-2 z-100">
          Back online! Connection restored
        </div>
      )}

      </>
    );
  }

  return null;
};

export default NetworkStatus;