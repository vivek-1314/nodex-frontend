import React, { useEffect, useState } from 'react'

const smallscreendetection = () => {

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1055);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1055);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {
        isSmallScreen && (
            <div className="w-full h-screen fixed inset-0 z-50 bg-black text-white font6 text-[1.4rem] flex flex-col gap-2 text-center justify-center items-center">
                <p>Not Compatible for small screens</p>
                <p>please switch to laptop/desktop</p>
            </div>
        )
      }
    </div>
  )
}

export default smallscreendetection
