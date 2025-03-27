import React, { useContext, useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FirebaseContext } from '../context/firebasecontext';

const LandingPage = () => {
  const navigate = useNavigate();
  const [navbarfocusidx , setNavbarFocusIdx] = useState(null);
  const {user} = useContext(FirebaseContext) ;

  //navigation logic
  useEffect(() => {
          if (user) {
              navigate("/");  
          }
        }, []);

  return (
    <div className='flex flex-col bg-[#1d1c1d] h-screen w-full pt-2 overflow-hidden'>
      <div className='flex justify-between py-2 px-3 animate-delay'>
        <div className="flex gap-2 font-bold justify-center items-center">
            <img className='w-8 h-8' src="https://cdn-icons-png.freepik.com/256/18644/18644093.png?ga=GA1.1.771025357.1740120503&semt=ais_hybrid" alt="img" />
            <span  className='name font-2xl text-white tracking-wide'>Nodex</span>
        </div>
        <div className="navbar absolute left-1/2 transform -translate-x-1/2 border-[0.1rem] border-[#414143] rounded-full px-6 flex gap-1 items-center text-sm  justify-center">{
            ["Features" ,"Products", "Prices" , "Contact"].map((value, i) => {
                return <motion.a href="https://docs.google.com/document/d/1wf7VOg-21GD-Go8VjsCBlxHQJIQw_G3Ji1pQFSbv_tc/edit?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"  key={i} initial={{y:-50*i}} animate={{y:0}} transition={{delay: 0.5 , duration: 0.3}} onMouseEnter={() => {setNavbarFocusIdx(i)}} onMouseLeave={() => {setNavbarFocusIdx(null)}} className={` rounded-xl px-4 py-2 ${navbarfocusidx===i ? ' text-[#A495BD] font9' : 'text-white text-sm'} `}>{value}</motion.a>
            })
        }</div>

        <div className="flex gap-2">
            <Link to='/SignIn' className='flex justify-center items-center button rounded-full px-6 py-2 bg-[#2d2d2d] text-white text-sm'>Sign In</Link>
            <Link to='/SignIn' className='button rounded-full px-7 py-2 border border-[0.1rem] text-white text-sm border-[#414143]'>Get Started</Link>
        </div>

      </div>

      <div className='w-full flex flex-col items-center'>
        <div className='heading pt-16 flex flex-col items-center text-white text-[3rem]'>
        <div className="flex gap-4">{
              ["Activate" , "Your"  , "Node"].map((val , index) => {
                return (<span key={index} className={`animate-fade-in opacity-0 ${index === 2? "text-[#A495BD]" : ""} `} style={{ animationDelay: `${1.2+index * 0.0}s` }}  >{val}</span>)
              })
              }</div>
            <div className="flex gap-4">{
              ["Build" , "Professional"  , "Connection"].map((val , index) => {
                return (<span key={index} className='animate-drop  opacity-0' style={{ animationDelay: `${index * 0.31}s` }} >{val}</span>)
              })
              }</div>
        </div>

        <div className='animate-delay summary text-[#6B6B6B] w-100 pt-3 pb-4 text-center text-sm '>Activate your node to build meaningful connections, unlock opportunities, and grow your network effortlessly.</div>

        <div className='animate-delay pb-14 flex gap-2'>
            <Link to='/SignIn' className='flex justify-center items-center button rounded-full px-6 py-2 bg-[#F5E6DA] text-black text-sm hover:bg-[#A495BD]'>Get Started</Link>
            <button onClick={() => window.open('https://docs.google.com/document/d/1wf7VOg-21GD-Go8VjsCBlxHQJIQw_G3Ji1pQFSbv_tc/edit?usp=sharing', '_blank')}   className='button rounded-full px-6 py-2 bg-[#2d2d2d] text-white text-sm'>How it Works</button>
        </div>
      </div>

      <div className="flex-1 w-full px-20 py-10 animate-delay">
            <motion.div initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay:0.0 , ease: [.25,.13,.24,-0.25] }}
              className="w-full h-full p-2 border-t-5 border-l-5 border-r-5     border-[#414143] rounded-t-3xl overflow-hidden object-cover">
              <img className='w-full h-full rounded-t-2xl opacity-80' src="./images/nodeximgblack.png" alt="" />
            </motion.div>
      </div>
    </div>
  )
}

export default LandingPage
