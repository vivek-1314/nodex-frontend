import { useContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingpage';
import Home from './pages/Home';
import Userdetails from './pages/userdetails';
import Nodes from './pages/Nodes';
import Connections from './pages/Connections';
import Events from './pages/Events';
import News from './pages/News';
import SignIn from './pages/Signin';
import Useprotectedwrapper from './context/useprotectedwrapper';
import Profilepage from './pages/profilepage'
import { auth } from "./firebase";
import { FirebaseContext } from './context/firebasecontext';
import NetworkStatus  from './component/networkstatus';
import {useUser} from './context/usercontext'

function App() {

    const {loading} = useUser() ;
 
    if (loading) return <div className='font8 h-screen w-full text-[2rem] flex leading-none text-center justify-center items-center '><span>Loading please Wait...  </span></div>;

  return (
    <>
    <NetworkStatus />
    <Routes>
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />

      <Route element={<Useprotectedwrapper />}>
                <Route path="/userdetails" element={<Userdetails />} />
                <Route path="/profile/:id" element={<Profilepage/>} />
                <Route path="/" element={<Home />}>
                    <Route index element={<Nodes />} />
                    {/* <Route path="nodes" element={<Nodes />} /> */}
                    <Route path="connections" element={<Connections />} />
                    <Route path="events" element={<Events />} />
                    <Route path="news" element={<News />} />
                </Route>
        </Route>
    </Routes>
    </>
  );
}

export default App;