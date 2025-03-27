import React, { useContext, useEffect, useState } from 'react'
  import { useUser } from '../context/usercontext'
import { FirebaseContext } from '../context/firebasecontext'

const Connections = () => {

  const { userdetails } = useUser() ;
  const {user} = useContext(FirebaseContext);
  const [followers, setFollowed] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!user || !userdetails) return;
    setFollowed(userdetails.followers || []);
    console.log(userdetails.following);
    setFollowing(userdetails.following || []);
  }, [userdetails]); 


  // const following = [
  //   {
  //     user: "user",
  //     userName: "John Doe",
  //     profession: "Software Engineer"
  //   },
  //   {
  //     user: "user",
  //     userName: "Jane Smith",
  //     profession: "Product Designer"
  //   },
  //   {
  //     user: "user",
  //     userName: "Michael Johnson",
  //     profession: "Data Scientist"
  //   },
  //   {
  //     user: "user",
  //     userName: "Emily Davis",
  //     profession: "Marketing Manager"
  //   },
  //   {
  //     user: "user",
  //     userName: "David Brown",
  //     profession: "UX Researcher"
  //   },
  //   {
  //     user: "user",
  //     userName: "David Brown",
  //     profession: "UX Researcher"
  //   }
  // ];

  const suggestions = [
    {
      user: "user",
      userName: "John Doe",
      profession: "Software Engineer"
    },
    {
      user: "user",
      userName: "Jane Smith",
      profession: "Product Designer"
    },
    {
      user: "user",
      userName: "Michael Johnson",
      profession: "Data Scientist"
    },
    {
      user: "user",
      userName: "Emily Davis",
      profession: "Marketing Manager"
    },
    {
      user: "user",
      userName: "David Brown",
      profession: "UX Researcher"
    },
    {
      user: "user",
      userName: "David Brown",
      profession: "UX Researcher"
    }
  ];

  return (
    <div className='h-full w-full rounded-2xl flex px-10 py-8  items-center gap-18'>
      <div className="relative w-1/3 h-80 p-2 rounded-[2.3rem] bg-white flex flex-col gap-2 pt-14 px-6 overflow-y-auto hide-scrollbar">
          <span className='absolute top-2 left-1/2 transform -translate-x-1/2 font4 text-sm'>{`${followers.length} •  FOLLOWERS`}
          </span>
          {
            followers.map((value, i) => {
              return (<div key={i} className="flex justify-between items-start mb-3 gap-2 ">
                <section className='flex gap-4 items-center w-full'>
                  <img className='w-8 h-8 rounded-2xl' src={value.profilePicUrl} loading='lazy' alt="img" />
                  <section className=' flex flex-col items-start justify-start gap-1'>
                    <span className='font8 text-[0.8rem] leading-none'>{value.name}</span>
                    <span className='font6 text-[0.7rem] leading-none'>{value.professionalTitle}</span>
                  </section>
                </section>
              </div>)
            })
          }
      </div>

      <div className="relative w-1/3 h-80 p-2 rounded-[2.3rem] bg-white flex flex-col gap-2 pt-14 px-6 overflow-y-auto hide-scrollbar">
          <span className='absolute top-2 left-1/2 transform -translate-x-1/2 font4 text-sm'>{`${following.length} • FOLLOWINGS`}
          </span>
          {
            following.map((value, i) => {
              return (<div key={i} className="flex justify-between items-start mb-3 gap-2 ">
                <section className='flex gap-2 justify-between items-center'>
                  <img className='w-8 h-8 rounded-full' src={value.profilePicUrl} loading='lazy' alt="img" />
                  <section className=' flex flex-col items-start justify-start gap-1'>
                    <span className='font8 text-[0.8rem] leading-none'>{value.name}</span>
                    <span className='font6 text-[0.7rem] leading-none'>{value.professionalTitle}</span>
                  </section>
                </section>
                <button className='bg-[#cc6b68] text-white  text-[0.8rem] py-[0.2rem] rounded-2xl px-4 flex justify-center items-center'>Disconnect</button>
              </div>)
            })
          }
      </div>

      <div className="relative w-1/3 h-full border-2 border-white p-2 rounded-[2.3rem] grid grid-cols-2 grid-rows-3 gap-2 pt-10 ">
      <span className='absolute top-2 left-1/2 transform -translate-x-1/2 font4 text-sm'>EXPAND NETWORK</span>
          {
            suggestions.map((value, i) => {
              return (<div key={i} className="bg-white rounded-[2.3rem] flex flex-col justify-center items-center gap-1">
                <img className='w-5 h-5' src={`../images/man2.png`} alt="" />
                <section className='flex flex-col items-center justify-start'>
                    <span className='font8 text-[0.7rem]  leading-none'>{value.userName}</span>
                    <span className='font6 text-[0.6rem]  leading-none'>{value.profession}</span>
                  </section>
                <button className=' bg-[#80a2dc] text-[0.7rem] text-white rounded-2xl py-[0.2rem] px-3 flex justify-center items-center'>Connect</button>
              </div>)
            })
          }
          
      </div>
    </div>
  )
}

export default Connections
