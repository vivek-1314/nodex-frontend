import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { FirebaseContext } from '../context/firebasecontext';

const Nodes = () => {

  const [posts, setPosts] = useState([]);  
  const [lastFollowedPostCreatedAt , setlastFollowedPostCreatedAt] = useState(null) ;
  const [lastRandomPostCreatedAt , setlastRandomPostCreatedAt] = useState(null) ;
  const [loading, setLoading] = useState(false);
  const {user} = useContext(FirebaseContext) ;
  const lastPostRef = useRef(null);
  const auth = getAuth() ;

//fetch feed
  const fetchFeed = async () => {
    if (loading) return; 
    setLoading(true);

    try { 
          const token = await auth.currentUser.getIdToken(true); 
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/post/getfeed`, 
            {
                params: {
                    lastFollowedPostCreatedAt,
                    lastRandomPostCreatedAt
                },
                headers: { Authorization: `Bearer ${token}` }
            }
        );
    
        console.log("new feed has come" , res.data.feed.length , res.data.feed);
        if (res.data.feed.length > 0) {
            setPosts((prev) => [...prev, ...res.data.feed]); 
            setlastFollowedPostCreatedAt(res.data.newlastFollowedPostCreatedAt || lastFollowedPostCreatedAt) ;
            setlastRandomPostCreatedAt(res.data.newlastRandomPostCreatedAt || lastRandomPostCreatedAt) ;
        }
    } catch (error) {
        console.error("Error fetching feed:", error);
    } finally {
        setLoading(false);
    }
};

//refetching feed logic
useEffect(() => {
  if (!lastPostRef.current) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        console.log("Last post is visible! Fetching more...");
        fetchFeed();
      }
    },
    { threshold: 1.0 } // Trigger when fully in view
  );

  observer.observe(lastPostRef.current);

  return () => observer.disconnect(); // Cleanup observer
}, [posts]); 

//fetching feed on first call
useEffect(() => {
  if(!user) return ;
  fetchFeed();
}, [user]);

//text shortner
const TruncatedText = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <p onClick={() => setIsExpanded(!isExpanded)}  className="font7 leading-[16px] text-[0.8rem]">
      {isExpanded ? (text || "") : `${text.slice(0, maxLength)}... `}
      {text.length > maxLength && (
        <span 
          className="text-blue-500 font8 cursor-pointer"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </span>
      )}
    </p>
  );
};

//handling comments
const [visibleindex, setVisibleindex] = useState(null);
const [comments, setComments] = useState({});
const observerRefs = useRef(new Map());

useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Number(entry.target.getAttribute("data-post-index")); // ✅ Convert to number
                    if (!isNaN(index)) {
                        setVisibleindex(index); // ✅ Set visible post index
                    }
                }
            });
        },
        { root: null, threshold: 0.5 } // ✅ When 50% of post is visible
    );

    posts.forEach((post, index) => {
        const element = observerRefs.current.get(index); // ✅ Use index here
        if (element) observer.observe(element);
    });

    return () => observer.disconnect();
}, [posts]);

useEffect(() => {
    if (visibleindex !== null && !comments[visibleindex]) {
        const post = posts[visibleindex]; // ✅ Get post by index
        if (post) {
            setComments(prev => ({ ...prev, [visibleindex]: post.comments })); // ✅ Fix variable name
        }
    }
}, [visibleindex, posts]);

const [commenttext , setcommenttext] = useState("") ;
const [commentadding , setcommentadding] = useState("Add") ;

//adding comments 
const handlecomment = async () => {
  const id = posts[visibleindex]._id ;
  if(!commenttext) return ;
  try { 
      setcommentadding("Adding") ;
      const token = await auth.currentUser.getIdToken(true); 
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/post/${id}/comment`, 
        {
          comment : commenttext  
        },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    setcommentadding("Added") ;
    setTimeout(() => {
      setcommenttext("");
      setcommentadding("Add") ;
    }, 3000);
    console.log("comment added");
  } catch (error) {
    console.error("Error adding comment ", error);
  }
}


  const [aisummaryopen , setaisummaryopen] = React.useState(false) ;
  const [aisummaryopen2 , setaisummaryopen2] = React.useState(false) ;

  return (
    <div className='w-full h-full rounded-2xl px-4 py-6 flex justify-between items-center gap-10'>
      <div className="relative w-1/4 p-1 h-[57vh] overflow-y-auto hide-scrollbar snap-y snap-mandatory">
        {/*  */}
        {posts.map((post , i) => (
                <div key={i}
                data-post-index={i}
                ref={el => observerRefs.current.set(i, el)}
                className="post-container relative w-full h-full p-2 rounded-3xl bg-white mb-4  flex flex-col justify-between snap-start ">
                <div className="absolute w-2 h-4 top-1/6 rounded-l-full border border-l-3 border-t-3 border-b-3 border-[#d7dce7] right-0  bg-[#2585ad]"></div>
                <div className="px-1 flex justify-start items-center gap-2 ">
                    <img className='h-9 w-9 rounded-full overflow-hidden object-cover' src={post.userDetails.profilePicUrl} alt="" />
                    <section className='flex flex-col gap-1 '>
                        <span className='font8 text-[0.9rem] leading-none'>{post.userDetails.name}</span>
                        <span className='font6 text-[0.8rem] leading-none'>{post.userDetails.professionalTitle}</span>
                    </section>
                </div>
                <div className="px-1 mt-4  max-w-full">
                  <span className='font7 leading-none text-[0.8rem]'><TruncatedText text={post.content} maxLength={100} /></span>
                </div>
                <div className="overflow-hidden rounded-2xl mt-3 w-full h-48 flex-grow">
                  <img className='h-full w-full object-cover opacity-95' src={post.imageUrl} alt="img" />
                </div>
                {i === posts.length - 1 && <div ref={lastPostRef}></div>}
            </div>
            ))}
            {loading && <div className="relative w-full h-full p-2 rounded-3xl bg-white mb-4  flex flex-col justify-between snap-start ">
                <div className="absolute w-2 h-4 top-1/6 rounded-l-full border border-l-3 border-t-3 border-b-3 border-[#d7dce7] right-0  bg-[#2585ad]"></div>
                <div className="px-1 flex justify-start items-center gap-2 ">
                    <div className='h-9 w-9 rounded-full overflow-hidden bg-gray-300'/>
                    <section className='flex flex-col gap-1 w-10'>
                        <div className='bg-gray-300 w-30 h-2 rounded-lg'></div>
                        <div className='bg-gray-300 w-30 h-2 rounded-lg'></div>
                    </section>
                </div>
                <div className="px-1 mt-4 max-w-full bg-gray-300 h-30 rounded-2xl">
                </div>
                <div className="overflow-hidden rounded-2xl mt-3 w- bg-gray-300 h-48 flex-grow">
                  
                </div>
            </div>}
        </div>  
              
        <div className="relative w-1/4 h-80 p-2 rounded-3xl flex flex-col gap-1 bg-white">
          <div className="absolute w-2 h-4 bottom-1/6 rounded-r-full border border-r-3 border-t-3 border-b-3 border-[#d7dce7] left-0  bg-[#2585ad]"></div>
          
          <div className="flex gap-2 flex-col h-full w-full overflow-hidden rounded-xl">
          <div className={`relative w-full rounded-2xl pt-6 pl-1 overflow-hidden transition-all duration-300 ${aisummaryopen ? 'h-1/2' : 'h-0'}`}>
            <span onClick={() => setaisummaryopen(!aisummaryopen)} className='absolute top-1 left-1 font6 text-[0.8rem] text-[#0045da]'>Ai- Generated summary</span>
            <span className="relative font7 text-[0.8rem] mt-3 leading-tight">Artificial Intelligence (AI) is transforming technology by enhancing automation, decision-making, and user self-driving cars and AI-powered</span>
          </div>

          <hr className='border-[1px] border-gray-500'></hr>

          <div className="flex-1 flex flex-col gap-1 overflow-y-scroll hide-scrollbar">
          {!(posts.length && visibleindex != null && visibleindex >= 0) ? null : (
            <div className="comments-section">
                {posts[visibleindex].comments ? (
                    posts[visibleindex].comments.length > 0 ? (
                      posts[visibleindex].comments.map((comment, index) => (
                          <div key={index} className="p-1 flex gap-2 justify-start items-center">
                          <img className='w-6 h-6 rounded-xl' src={comment.profilePicUrl} alt="img" />
                          <section className=' flex flex-col items-start justify-start gap-1'>
                            <span className='font8 text-[0.8rem] leading-none'>{comment.name}</span>
                            <span className='font6 text-[0.7rem] leading-none'>{comment.text}</span>
                          </section>
                        </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No comments yet.</p>
                    )
                ) : (
                    <p className="text-gray-400">Loading comments...</p>
                )}
            </div>
        )}
          </div>  
          
          </div>

          <div className="sticky place-self-end bottom-0 left-0 h-10 w-full  rounded-xl p-2 flex items-center justify-between gap-1">
            <input onChange={(e) => setcommenttext(e.target.value)} value={commenttext} className='w-full h-full rounded-l-xl pl-3 bg-[#668CFF] text-white font8 text-[0.7rem]' placeholder='Add a comment' type="text" />
            <button onClick={() => handlecomment()} className='bg-[#3366FF] hover:bg-[#159A70] px-2 text-[0.6rem] py-1 text-white rounded-r-xl '>{commentadding}</button>
          </div>
        </div>

        <div className="cursor-not-allowed relative w-1/4 h-80 p-2 rounded-3xl bg-white flex flex-col gap-2 ">
        <div className="absolute w-2 h-4 top-1/6 rounded-l-full border border-l-3 border-t-3 border-b-3 border-[#d7dce7] right-0  bg-[#2585ad]"></div>
          <div className={`relative w-full rounded-2xl pt-6 pl-1 overflow-hidden transition-all duration-300 ${aisummaryopen2 ? 'h-1/2' : 'h-0'}`}>
            <span onClick={() => setaisummaryopen2(!aisummaryopen2)} className='absolute top-1 left-1 font6 text-[0.8rem] text-[#0045da]'>Ai- Generated summary</span>
            <span className="relative font7 text-[0.8rem] mt-3 leading-tight">Artificial Intelligence (AI) is transforming technology by enhancing automation, decision-making, and user self-driving cars and AI-powered</span>
          </div>

          <hr className='border border-[1px] border-gray-500'></hr>

          <div className="flex flex-col gap-1">
            <div className="p-1 flex gap-2 justify-start items-start">
              <img className='w-6 h-6' src="https://cdn-icons-png.flaticon.com/128/1154/1154448.png" alt="img" />
              <section className=' flex flex-col items-start justify-start gap-1'>
                <span className='font8 text-[0.8rem] leading-none'>Parinidhi Kushba</span>
                <span className='font6 text-[0.7rem] leading-none'>Nice, this is super insightful!</span>
              </section>
            </div>
            <div className="p-1 flex gap-2 justify-start items-start">
              <img className='w-6 h-6' src="https://cdn-icons-png.flaticon.com/128/1154/1154448.png" alt="img" />
              <section className=' flex flex-col items-start justify-start gap-1'>
                <span className='font8 text-[0.8rem] leading-none'>Akansha ...</span>
                <span className='font6 text-[0.7rem] leading-none'>Good to see !!</span>
              </section>
            </div>
            <div className="p-1 flex gap-2 justify-start items-start">
              <img className='w-6 h-6' src="https://cdn-icons-png.flaticon.com/128/1154/1154448.png" alt="img" />
              <section className=' flex flex-col items-start justify-start gap-1'>
                <span className='font8 text-[0.8rem] leading-none'>sumita Kushba</span>
                <span className='font6 text-[0.7rem] leading-none'>Great work !</span>
              </section>
            </div>
            <div className="p-1 flex gap-2 justify-start items-start">
              <img className='w-6 h-6' src="https://cdn-icons-png.flaticon.com/128/1154/1154448.png" alt="img" />
              <section className=' flex flex-col items-start justify-start gap-1'>
                <span className='font8 text-[0.8rem] leading-none'>Rahul Patil</span>
                <span className='font6 text-[0.7rem] leading-none'>Check DM ::</span>
              </section>
            </div>
          </div>
        </div>

        <div className="cursor-not-allowed w-1/4 p-1 h-[57vh] overflow-y-auto hide-scrollbar snap-y snap-mandatory">
        <div  className="relative w-full h-full p-2 rounded-3xl bg-white mb-4  flex flex-col justify-between snap-start ">
                <div className="absolute w-2 h-4 top-1/6 rounded-l-full border border-l-3 border-t-3 border-b-3 border-[#d7dce7] right-0  bg-[#2585ad]"></div>
                <div className="px-1 flex justify-start items-center gap-2 ">
                    <img className='h-9 w-9 rounded-full overflow-hidden' src="https://cdn-icons-png.flaticon.com/128/4140/4140061.png" alt="" />
                    <section className='flex flex-col gap-1 '>
                        <span className='font8 text-[0.9rem] leading-none'>Tanishq Kumar</span>
                        <span className='font6 text-[0.8rem] leading-none'>Aerospace engineer</span>
                    </section>
                </div>
                <div className="px-1 mt-4  max-w-full">
                  <span className='font7 leading-none text-[0.8rem]'><TruncatedText text={"Technology has become the backbone of modern civilization, transforming how we work, communicate, and live. "} maxLength={100} /></span>
                </div>
                <div className="overflow-hidden rounded-2xl mt-3 w-full h-48 flex-grow">
                  <img className='h-full w-full object-cover opacity-95' src="./images/post2img.jpg" alt="img" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Nodes
