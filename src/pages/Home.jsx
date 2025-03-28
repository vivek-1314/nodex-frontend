import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { FirebaseContext } from '../context/firebasecontext';
import Userdetails from './userdetails';
import axios from 'axios'
import { getAuth } from 'firebase/auth';
import { useLocation } from "react-router-dom";
import { useUser } from '../context/usercontext'

const Home = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const {user} = useContext(FirebaseContext) ;
    const { userdetails } = useUser() ;
    const [userprofilepicurl , setuserprofilepicurl] = useState(null) ;
    const [following, setFollowing] = useState([]);
      useEffect(() => {
        if (!user || !userdetails) return;
        setFollowing(userdetails.following || []);
        setuserprofilepicurl(userdetails.profilePicUrl || null );
      }, [userdetails]); 

    const [searchquery , setsearchquery] = useState("") ;
    const inputRef = useRef(null);
    const [searchedusers , setsearchedusers] = useState([{}]) ;
    const [loadingsearch , setloadingsearch] = useState(false) ;
    const [error , seterror] = useState(false) ;
    const [iconfocusid , seticonfocusid] = React.useState(null) ;
    const [searchopen , setsearchopen] = useState(false) ;
    const icons = ["back" ,"check-mark", "iphone" , "plus" , "send" , "share" , "star" , "upload" , "warning"]; 
    const [modalopen , setmodalopen] = useState(false) ;
    const [image, setImage] = useState(null);
    const [file, setfile] = useState(null);
    const location = useLocation();
    const lastSegment = location.pathname.split("/").filter(Boolean).pop();
    const [focusidx , setfocusidx] = useState(() => {
        return lastSegment ? lastSegment : 'Nodes';
      }); ;

    
    //tooltip
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
    const handleMouseEnter = (event) => {
        setTooltip({
            visible: true,
            x: event.clientX + 10,
            y: event.clientY + 10,
        });
    };
    const handleMouseMove = (event) => {
        setTooltip((prev) => ({ ...prev, x: event.clientX + 10, y: event.clientY + 10 }));
    };
    const handleMouseLeave = () => {
        setTooltip({ visible: false, x: 0, y: 0 });
    };

    // .../search API call for searching users
    const handleKeyDown = async (e) => {
        if (
          e.key === "Enter" &&
          searchquery.trim() !== "" &&
          document.activeElement === inputRef.current
        ) {
          try {
            const auth = getAuth();
            setloadingsearch(true) ;
            seterror(false) ;
            const token = await auth.currentUser.getIdToken(true);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/search/`, {
                params: { query: searchquery },
                headers: { Authorization: `Bearer ${token}` } 
            });
            // console.log("Search query:", searchquery);
            // console.log("Search results:", response.data);
            setloadingsearch(false) ;
            if(response.data.length === 0) {
                seterror(true) ;
            }
            setsearchedusers(response.data) ;
          } catch (error) {
            console.error("Error fetching search results:", error);
          }
        }
      };

    //post image upload handler
    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setfile(selectedFile); 
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

  const [title , settitle] = useState("") ;
  const [content , setcontent] = useState("") ;
  const [tags , settags] = useState("") ;
  const [uploadingpost , setuploadingpost] = useState(false) ;

  //uploading post handler
  const handlepost = async () => {
    if (!title || !content || !file) {
        alert("Please fill in all fields and select an image!");
        return;
      }

        setuploadingpost(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", tags);
      formData.append("image", file); 

      try {
        const token = await auth.currentUser.getIdToken(true);
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/post/createpost`, formData, {
            headers: { Authorization: `Bearer ${token}`}
        });

        if (response.status !== 201) {
            throw new Error("Failed to create post");
        }
        // console.log("Post created successfully:", response.data);
        alert("Post created successfully!");
        setmodalopen(false);
        settitle("");
        setcontent("");
        settags("");
        setfile(null);
    } catch (error) {
        console.error("Error creating post:", error);
        alert("Error creating post: " + error.message);
    } finally {
        setuploadingpost(false);
    }
  }

  return (
    <div onClick={() => {
        setsearchopen(false) ;
    }}  className='overflow-hidden h-screen w-full p-3 bg-[#d0d7dc] backdrop-blur-3xl'>
        {/* modal for creating post*/}
        <div className={`fixed inset-0 bg-white/2 backdrop-blur-[10px] z-1 ${modalopen ? 'visible' : 'invisible' } transition-all duration-800 delay-100 ease-in`}></div>
        <div className={`fixed p-2 flex flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[40vh] bg-[#d3d4db] z-1 overflow-hidden rounded-3xl ${modalopen ? 'visible  h-[70vh]' : 'invisible' } transition-all duration-800 delay-100 ease-in-out `}>
            <div className="flex justify-between px-3 pt-2 font6 text-xl">
                <span>Create a Post</span>
                <a onClick={() => setmodalopen(false)} className='bg-white rounded-full text-sm leading-none p-2'>X</a>
            </div>
            <div className="flex-1 rounded-2xl mt-2 bg-white ">
                <div className="grid grid-cols-5 grid-rows-5 gap-2 h-full">
                    <div className="col-span-4  rounded-md py-3 flex justify-start px-2">
                        <input type="text" value={title} onChange={(e) => {settitle(e.target.value)}} className='h-full w-full border border-1 border-black rounded-lg pl-3 text-black font8' placeholder='Title'/>
                    </div>
                    <div className="col-start-5  rounded-md flex justify-center items-center py-3">
                        <button onClick={handlepost} className='bg-[#e1bb80] hover:bg-[#e07a5f] hover:scale-105  h-full w-full mx-2 rounded-lg font8 text-[#352208]'>{uploadingpost?"Uploading":"post"}</button>
                    </div>
                    <div className="col-span-2 row-span-3 row-start-2  rounded-md ">
                    <div className="flex flex-col items-center justify-center w-64 h-54 pl-2">
                        <label
                            className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-400 rounded-xl cursor-pointer bg-gray-100 hover:bg-gray-200"
                        >
                            <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageChange} 
                            />
                            {image ? (
                            <img src={image} alt="Preview" className="w-64 h-54 object-cover rounded-xl" />
                            ) : (
                            <span className="text-gray-500">Click to upload an image</span>
                            )}
                        </label>
                        </div>
                    </div>
                    <div className="col-span-3 row-span-3 col-start-3 row-start-2  rounded-md px-2">
                    <textarea type="text" value={content} onChange={(e) => {setcontent(e.target.value)}}  className='  border-2 border-dashed border-gray-600   pt-3 h-full w-full rounded-lg pl-3 text-black font8 align-top' placeholder='Content'/>
                    </div>
                    <div className="col-span-5 row-start-5 rounded-md py-3 px-2">
                    <input type="text" value={tags} onChange={(e) => {settags(e.target.value)}} className='h-full w-full border-2 border-black rounded-lg pl-3 text-black font8' placeholder='Tags'/>
                    </div>
                </div>
            </div>
        </div>

      <div className='flex justify-between py-2 px-3'>
        <div className="flex gap-2 font-bold justify-center items-center">
            <img className='w-8 h-auto ' src="./images/logo.png" alt="img" />
            <span  className='name font-2xl text-black tracking-wide'>Nodex</span>
        </div>
        <div className="navbar absolute left-1/2 transform -translate-x-1/2 px-6 flex gap-1 items-center text-sm font- justify-center ml-7">{
            ["Nodes" ,"Connections", "Events" , "News"].map((value, i) => {
                return <NavLink key={i} to={`${value === 'Nodes' ? '/' : value}`} onClick={ () => {setfocusidx(value)}} className={`ml-6 text-sm px-4 py-2 rounded-full px-3 transition-all duration-300 ease-in-out ${focusidx === value ? "bg-black text-white": "text-black"}`}>{value}</NavLink>
            })
        }</div>
        <div className="relative flex gap-1 ">
            <button onClick={(e) => {
                e.stopPropagation();
                setsearchopen(true) ;
            }} className={`${searchopen ? "absolute w-70 h-[90vh] top-0 right-0 z-10 rounded-xl transition-[width] duration-300 ease-out bg-white/30 backdrop-blur-lg backdrop-saturate-150 shadow-lg" : "flex rounded-full p-4 bg-white"} justify-center items-center h-10 w-12`}>{!searchopen && <img src="https://cdn-icons-png.flaticon.com/128/54/54481.png" alt="" />} {
                searchopen && 
                <div className="h-full w-full rounded-xl p-4 flex flex-col gap-2">
                    <input onChange={(e) => {
                        setsearchquery(e.target.value) ;
                    }} onKeyDown={handleKeyDown} ref={inputRef} value={searchquery} className='font7 font-semibold h-8 w-full rounded-2xl px-4 text-sm bg-[#3C8DD9] focus:outline-none text-white' placeholder='Search for connections' />
                    <div className=" w-full h-full flex-1">
                    <>
                        {loadingsearch && <span className='text-[0.9rem] font6 text-black'>Searching....</span>}
                        {error && <span className='text-[0.9rem] font6 text-black'>No user found...</span>}
                    </>
                        {
                            (searchedusers).map((val , index) => {
                                return (
                                    <Link to={`/profile/${val.id}`} key={index} className="w-full h-10 mt-2 flex items-center justify-start gap-6 ">
                                        <img className='w-8 h-8 rounded-full object-cover' src={val.profilePicUrl || "./images/user.png"} alt="" />
                                        <section className='flex flex-col w-full justify-center items-start gap-1'>
                                            <span className='font8 text-[0.8rem] leading-none'>{val.name}</span>
                                            <span className='font6 text-[0.7rem] leading-none text-[#555554]'>{val.
professionalTitle
}</span>
                                        </section>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            }</button>
            <a href='#' className='flex justify-center items-center rounded-full bg-white h-10 w-12 p-4'><img src="https://cdn-icons-png.flaticon.com/128/11502/11502423.png" alt="" /></a>
            <a href='#' className='flex justify-center items-center rounded-full bg-white h-10 w-12 p-4'><img src="https://cdn-icons-png.flaticon.com/128/10502/10502974.png" alt="" /></a>
            <Link to="/userdetails" className='flex justify-center items-center rounded-full bg-white h-10 w-12 overflow-hidden' ><img className='object-cover' src={userprofilepicurl || "./images/user.png"} alt="" /></Link>
        </div>
      </div>

      <div className="w-full h-full mt-6 flex gap-0 ">
        <div className="flex flex-col ">
            {
                icons.map((value, i) => {
                    return <a onMouseEnter={(event) => {
                        handleMouseEnter(event); 
                        seticonfocusid(i);
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => {
                        handleMouseLeave(); 
                        seticonfocusid(null);
                    }} key={i} className={`flex cursor-not-allowed justify-center items-center h-10 w-10 p-3 rounded-full ml-3 mt-2 transition-all duration-200 ease-in-out ${iconfocusid === i ? "bg-[#c6d8e5]" :"bg-[#f4efeb]"} `}><img src={`/images/${value}.png`} alt="" /></a>
                })
            }
        </div>

        <div className="w-full h-[89%] pb-2 flex flex-col gap-2 justify-start items-start mt-2 pl-2 ">
            <div className="pl-1 font6 text-lg text-bold w-full text-[#103e67]"><span className=''>Connected :</span> <span className='text-black'>{`${user ? user.displayName : "loading..."}`}</span></div>
            <div className="relative bg-[linear-gradient(30deg,_rgba(213,220,231,1)_34%,_rgba(226,228,230,1)_85%)] h-[89%] w-full rounded-3xl flex flex-col gap-2 p-2">
                <div className="m flex gap-4 px-2 absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#d0d7dc] w-110 h-13 rounded-b-3xl ">
                    <div className="relative flex gap-[0.9rem] h-full w-110 overflow-x-auto hide-scrollbar ">
                {
                    following.map((value, i) => {
                        return <div key={i} className="min-w-10 max-w-10 h-10 rounded-full bg-white overflow-hidden"> <img className='object-cover' src={value.profilePicUrl} loading="lazy" alt="" /></div>
                    })
                }
                </div>
                </div>

                <div className="name font-bold w-full pl-2 pb-2  bg-transparent flex justify-between items-center">
                    <span className='rounded-full bg-[#d0d7dc] px-2 py-1'>{focusidx}</span>
                    <div className="flex gap-2">
                        <button onClick={() => setmodalopen(true)} className='flex justify-center items-center h-10 w-10 p-3 border border-[1.4px] border-black rounded-full ml-3 bg-[#d0d7dc]'><img src="../images/plus.png" alt="no" /></button>
                        <a href="#" className='flex justify-center items-center h-10 w-10 p-3 border border-[1.4px] border-black rounded-full ml-3 bg-[#d0d7dc]'><img src="../images/upload.png" alt="no" /></a>
                    </div>
                </div>

                <div className="w-full rounded-2xl flex-grow">
                    <Outlet />
                </div>
            </div>
        </div>
      </div>
      {tooltip.visible && (
                <div
                    className="absolute bg-black text-white px-3 py-1 rounded-lg text-sm font6"
                    style={{
                        top: tooltip.y,
                        left: tooltip.x,
                        position: "fixed",
                        zIndex: 50,
                    }}
                >
                    Feature in progress! ⚙️
                </div>
            )}
    </div>

    
  )
}

export default Home
