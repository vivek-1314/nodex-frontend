import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { FirebaseContext } from '../context/firebasecontext';
import { getAuth } from 'firebase/auth';

const profilepage = () => {
  
  const { id } = useParams();
  const [profileuser, setprofileuser] = useState({}); 
  const auth =  getAuth();
  const [fetchinguserdetails, setfetchinguserdetails] = useState(true);
  const [responseTime, setResponseTime] = useState(0);
  const [followed, setFollowed] = useState(false);
  const [showmessage, setshowmessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  // ...search/profile API call
  useEffect(() => {
    const startTime = Date.now();
    const fetchUser = async () => {
      const token = await auth.currentUser.getIdToken(true);
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/search/profile`, {
            params: { id },
            headers: { Authorization: `Bearer ${token}` } 
        });
          const endTime = Date.now(); 
          const apiResponseTime = endTime - startTime; 
          setResponseTime(apiResponseTime);
          console.log("response.data", response.data);
          setprofileuser(response.data);
          setFollowed(response.data.isFollowed);
          const delay = Math.max(2000 - apiResponseTime, 0);
          setTimeout(() => {
          setfetchinguserdetails(false);
          }, delay);

        } catch (error) {
            console.error("Error fetching user: profilepage ::", error);
        }
    };
    fetchUser();
}, []);

  // ...display follow/unfollow message
const displaymessage = (message) => {
  setMessageText(message);
  setshowmessage(true);
  setTimeout(() => {
    setshowmessage(false);
  }, 2000);
}

  // ...follow/unfollow API call
  const handlefollowunfollowfunc = async () => {
    const token = await auth.currentUser.getIdToken(true);
    if(!followed){
      try {
        const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/user/followpeople`, 
          { id },  
          { headers: { Authorization: `Bearer ${token}` } }
      );
      displaymessage(response.data.message) ;
      console.log(response.data);
      setFollowed(true);
      } catch (error) {
        console.error("Error following user:", error);
      }
    }
    else{
      try {
        const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/user/unfollowpeople`, 
          { id },  
          { headers: { Authorization: `Bearer ${token}` } }
      );
        displaymessage(response.data.message) ;
        console.log(response.data);
        setFollowed(false);
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    }
  }

  if (fetchinguserdetails) {
    return <h2 className='h-screen w-full font8 text-[1.2rem] text-center text-green-700 flex justify-center items-center'>Loading user details...</h2>;
  }


  return (
    <div className='relative h-screen w-full  flex flex-col px-10'>
      <div className="w-full bg-red-0 mt-20 flex justify-start items-end gap-6">

        {/* message box */}
        <div className={`absolute bottom-4 right-4 bg-[#28A745] text-white px-4 h-10 flex justify-center items-center rounded-lg ${showmessage ? "visible" : "invisible"}`}>
          <span className='font8 text-[1rem]'>{messageText}</span>
        </div>

        {/* user profile img */}
        <img className='w-45 h-45 rounded-[3rem] shadow-[inset_0_0_20px_pink] object-cover' src={profileuser.profilePicUrl} loading="lazy" alt="profilepic" />

        {/* userdetails */}
        <section className='flex flex-col items-start justify-end gap-1 mb-2'>
          <h4 className='font8 text-[1.5rem]'>{profileuser.name}</h4>
          <span className='font6 leading-none text-[0.97rem]'>{profileuser.professionalTitle}</span>
          <span className='font6 leading-none text-[0.87rem]'>{profileuser.location}</span>
          <section className='flex items-center justify-start gap-2 mt-2'>
            <button onClick={() => handlefollowunfollowfunc()} className=' bg-black text-white w-20  font7 rounded-lg leading-none text-[0.8rem] py-[9px] hover:bg-gray-600 '>{followed? "Unfollow" : "Follow"}</button>
            <button className='cursor-not-allowed border-[0.1rem]  border-black text-black  w-20 font7 rounded-lg leading-none text-[0.8rem] py-[8px]'>Message</button>
          </section>
        </section>

        {/* followers / following */}
        <section className='flex-1 h-full flex justify-end items-end'>
          <div className=" mr-10 flex mb-2 items-end gap-18">
            <section className=''>
              <h4 className='font8 text-black text-md'>Followers</h4>
              <span className='font8 text-black text-xl font-bold'>{profileuser.followers.length}</span>
            </section>
            <section className=''>
              <h4 className='font8 text-black text-md'>Following</h4>
              <span className='font8 text-black text-xl font-bold'>{profileuser.following.length}</span>
            </section>
          </div>
        </section>


      </div>

      <span className='mt-16  text-xl font8'>Nodes</span>
      <hr className='my-4' />
    </div>
  ) 
}

export default profilepage
