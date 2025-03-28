import React, { use, useContext, useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { FirebaseContext } from '../context/firebasecontext';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { useUser } from '../context/usercontext';

const UserDetails = () => {

  //user details form fields
  const cards = [
    { 
      id: 1, 
      title: "Social & Summary", 
      fields: [
        { label: "linkdinurl", type: "text", placeholder: "Enter LinkedIn URL" },
        { label: "location", type: "text", placeholder: "Enter your location "},
        { label: "bio", type: "textarea", placeholder: "Brief bio about you" }
      ],
      bg: "bg-[#fefeff]",
      initial: { x: "-20vw", y: "0", rotate: 0 }
    },
    { 
      id: 2, 
      title: "Professional Details", 
      fields: [
        { label: "professionalTitle", type: "text", placeholder: "Enter your professional Title" },
        { label: "skills", type: "text", placeholder: "Enter your skills" },
        { label: "industry", type: "text", placeholder: "Enter your industry" }
      ],
      bg: "bg-[#fefeff]",
      initial: { x: "-20vw", y: "0", rotate: 0 }
    },
    { 
      id: 3, 
      title: "Business Interests", 
      fields: [
        { label: "lookingFor", type: "text", placeholder: "E.g. Investors, Partners" },
        { label: "canoffer", type: "text", placeholder: "What you can offer" },
      ],
      bg: "bg-[#fefeff]",
      initial: { x: "-20vw", y: "0", rotate: 0 }
    },
    { 
      id: 4, 
      title: "Personal Details", 
      fields: [
        { label: "name", type: "text", placeholder: "Enter your name" },
        { label: "email", type: "email", placeholder: "Enter your email" },
        { label: "phoneno", type: "tel", placeholder: "Enter your phone number" }
      ],
      bg: "bg-[#fefeff]",
      initial: { x: "-20vw", y: "0", rotate: 0 }
    }
  ];

  const { user } = useContext(FirebaseContext);
  const { userdetails } = useUser()

  const navigate = useNavigate();
  const auth = getAuth();
  const [currentIndex, setCurrentIndex] = useState(3);
  const [formData, setFormData] = useState({}); 
  const [data , setdata] = useState({}) ;
  const [userposts, setuserposts] = useState([]) ;

  //populating user details from usercontext
  useEffect(() => {
    if (userdetails) {
      setdata(userdetails);
    }
  }, [userdetails]);

  // .../post/getposts api call for fetching user posts
  useEffect(() => {
    const fetchuserposts = async () => {
        if (!user) return; 
        try {
            const token = await auth.currentUser.getIdToken(true); 
            // console.log("token" , token) ;
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/post/getposts`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setuserposts(response.data.posts);
        } catch (err) {
            console.error(err.response?.data?.message || "Failed to fetch user");
        }
    };

    fetchuserposts();
  }, [user]);

  //populating form data 
  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        name: data.name || "",
        email: data.email || "",
        phoneno: data.phoneno || "",
        professionalTitle: data.professionalTitle || "",
        skills: data.skills || "",
        industry: data.industry || "",
        lookingFor: data.lookingFor || "",
        canoffer: data.canoffer || "",
        linkdinurl: data.linkdinurl || "",
        portfolio: data.portfolio || "",
        bio: data.bio || "",
        location: data.location || ""
      }));
    }
  }, [data]);  

  //card navigation functions
  const nextCard = () => setCurrentIndex((prev) => (prev + 1) % cards.length);
  const prevCard = () => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
          ...prev,
          [name]: value, 
      }));
  };


  // .../user/updateuser api call for updating user details
  const save = async () => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/updateuser`, formData, {
        headers: { Authorization: `Bearer ${token}`}
    });
      alert("User updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };


  return (
      <div className='relative flex overflow-hidden items-center gap-6  w-full h-screen bg-[#d1c2b1] px-4 py-6'>
          <img className='absolute opacity-75 -top-4 -left-2 w-1/2 h-auto' src="./images/llline.svg" alt="" />
          <img className='absolute opacity-75 -bottom-8 -right-0 w-1/2 h-auto' src="./images/rop2.svg" alt="" />
          <div className="relative flex flex-col justify-center items-center bg-[#d64c24] rounded-3xl w-1/2 h-full z-10">
              <motion.span initial={{y:"-1.2rem"}} animate={{y:0}} transition={{default: { duration: 0.4, ease: [0.39, 0.57, 0.56, 1]}}} className='absolute top-2 left-1/2 transform -translate-x-1/2 font8 text-[1.6rem] text-white'>Complete / Update</motion.span>
              <motion.span initial={{y:"-0.8rem"}} animate={{y:0}} transition={{default: { duration: 0.4, ease: [0.39, 0.57, 0.56, 1]}}} className='absolute top-10 left-1/2 transform -translate-x-1/2 font8 text-[1.6rem] text-white'>Your Profile</motion.span>
              <img className='absolute w-full h-full top-30 left-4 opacity-55' src="./images/svg3.svg" alt="" />
              {cards.map((card, index) => (
                  <motion.div
                      key={card.id}
                      initial={card.initial}
                      animate={{
                          y: 0,
                          x: `${-3 + (index * 2)}vh` ,
                          rotate: index === currentIndex ? 0 : 0,
                          opacity: index === currentIndex ? 1 : 0.6,
                      }}
                      transition={{
                          rotate: { duration: 0.3, ease: "easeInOut" },
                          opacity: { duration: 0.0, ease: "easeInOut" },
                          default: { duration: 0.6 , ease: [0.39, 0.57, 0.56, 1], delay: 0.1 * index },
                      }}
                      className={`absolute w-110 h-64 p-6 ${card.bg} rounded-lg shadow-custom-top`}
                      style={{ zIndex: index === currentIndex ? 10 : index }}
                  >
                      <div className="text-black font8">{card.title}</div>
                      <div className="flex w-full h-full flex-col py-6 justify-between items-start">
                          {card.fields.map((field, fieldIndex) => (
                              <input
                                  key={fieldIndex}
                                  name={field.label} 
                                  onChange={handleChange}
                                  value={formData[field.label] || ""} 
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  className="w-full font6 border border-[2px] border-[#d1c2b1] p-2 rounded-xl text-black"
                              />
                          ))}
                      </div>
                  </motion.div>
              ))}

              <div className="absolute bottom-4 flex gap-4">
                  <button onClick={prevCard} className="button rounded-full px-6 py-2 bg-[#2d2d2d] text-white text-sm">Previous</button>
                  <button onClick={nextCard} className="button rounded-full px-7 py-2 bg-[#1d1d1c] text-white text-sm">Next</button>
                  <button onClick={() => {
                    save() ;
                  }} className="button onhover:bg-[#2d2ddd] rounded-full px-6 py-2 bg-[#2d2d2d] text-white text-sm">Save & Continue</button>
              </div>
          </div>
          <div className='h-full flex flex-col items-center gap-4 w-1/2 rounded-3xl border-2 border-[#d64c24] pt-6 '>
          <span className='relative font8 text-[2rem] leading-none text-[#d64c24]'>Post</span>
          <div className='relative flex-1 w-full flex flex-col px-8 overflow-y-auto hide-scrollbar'>
              {
                userposts.map((post, index) => {
                  return (
                      <div className={`bg-white h-120 w-[55%] flex flex-col px-4 py-4 rounded-2xl shadow-xl ${index % 2 === 0 ? 'self-start' : 'self-end'}`} 
                      style={{ transform: `translateY(-${index * 25}px)` }}
                      key={index}
                      >
                        <span className='font6 text-md'>{post.title}</span>
                        <p className='font7 leading-[1.2rem] text-[0.88rem] mt-3'>{post.content}</p>
                        <div className="overflow-hidden rounded-2xl mt-3 w-full h-48 flex-1">
                          <img className='h-full w-full object-cover opacity-95' src={post.imageUrl} alt="img" />
                        </div>
                      </div>
                  )
                })
              }
              </div>
          </div>
      </div>
  );
};

export default UserDetails;
