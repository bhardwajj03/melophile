"use client"

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Share2,Play } from 'lucide-react'
import Image from "next/image"

import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

import Appbar from '../components/Appbar'

import { YT_REGEX } from "@/app/lib/utils";



interface Video {
  id: string;
  title: string;
  url: string;
  extractedId: string;
  upvotes: number;
  downvotes: number;
  thumbnail: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  userId: string;
  haveUpvoted: boolean;
}


const REFRESH_INTERVAL_MS=10*1000;

const creatorId="bae97c61-d9cb-46e9-bfec-d8a7ce9c6f88";


export default function Component() {
  const [inputLink, setInputLink] = useState('')
  const [queue, setQueue] = useState<Video[]>([])
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [loading,setLoading]=useState(false);


 async function refreshStreams(){
    const res=await fetch(`/api/streams/my`,{credentials:"include"});
    const json=await res.json();
    setQueue(json.streams)
  }
    /*function refreshStreams() {
      axios
        .get(`/streams/my`, {
          headers: { "Content-Type": "application/json",
            Authorization: `Bearer YOUR_TOKEN`, 
          },
        })
        .then((response) => {
          console.log("Streams data:", response.data);
          // Process the response data if needed
        })
        .catch((error) => {
          if (error.response) {
            // Server responded with a status outside the 2xx range
            console.log("Error response:", error.response);
          } else if (error.request) {
            // Request was made but no response received
            console.log("No response received:", error.request);
          } else {
            // Something else caused the error
            console.log("Error setting up request:", error.message);
          }
        });
    }*/
    

useEffect(() => {
    refreshStreams(); // Initial fetch
    const interval = setInterval(() => {
      refreshStreams();
    }, REFRESH_INTERVAL_MS);
      
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleSubmit=async (e:React.FormEvent)=>{
    e.preventDefault();
    setLoading(true)
    const res=await fetch("/api/streams/my",{
      method:"POST",
      body:JSON.stringify({
        creatorId,
        url:inputLink
      })
    });
    setQueue([...queue,await res.json()])
    setLoading(false);
    setInputLink('')
  }


  const handleVote=(id:string,isUpvote:boolean)=>{
    setQueue(queue.map(video=> video.id == id 
      ? {...video ,
        upvotes :isUpvote ? video.upvotes +1 : video.upvotes-1,
        haveUpvoted:!video.haveUpvoted
      }
      : video
      ).sort((a,b)=>(b.upvotes)-(a.upvotes)))

      fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`,{
        method:"POST",
        body:JSON.stringify({
          streamId:id
        })
      })
  }


  const playNext=()=>{
    if(queue.length > 0){
      setCurrentVideo(queue[0])
      setQueue(queue.slice(1))
    }
  }
 

  const handleShare = () => {
    const shareableLink = `${window.location.hostname}/creator/${creatorId}`
  
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        toast.success('Link copied to clipboard!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        console.error('Could not copy text:', err);
        toast.error('Failed to copy link. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <div className='flex flex-col min-h-screen bg-[rgb(10,10,10)] text-gray-200'>
      <Appbar />
      <div className='max-w-4xl mx-auto p-4 space-y-6 w-full'>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Song Voting Queue</h1>
          <Button onClick={handleShare} className="bg-purple-700 hover:bg-purple-800 text-white">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Input  
              type='text'
              placeholder='paste youtube link here'
              value={inputLink}
              onChange={(e)=>setInputLink(e.target.value)}
              className="bg-gray-900 text-white border-gray-700 placeholder-gray-500" 
          />
          <Button disabled={loading} onClick={handleSubmit}
          type='submit' className="w-full bg-purple-700 hover:bg-purple-800 text-white">{loading ? "Loading...": "Add to Queue"}</Button>
        </form>

        {inputLink && inputLink.match(YT_REGEX) && !loading &&(
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <LiteYouTubeEmbed id={inputLink.split("?v=")[1]} title=''/>
            </CardContent>
          </Card>
        )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Now Playing</h2>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            {currentVideo ? (
              <>
                <Image 
                  src="/placeholder.svg?height=360&width=640"
                  alt="current video"
                  className="w-full h-72 object-cover rounded"
                />
                <p className=" mt-2 text-center py-8  font-semibold text-white">{currentVideo.title}</p>
              </>
            ):(
              <p className=" text-center py-8  text-gray-400">No video Playing</p>
            )}
          </CardContent>
        </Card>
        <Button onClick={playNext} className="w-full bg-purple-700 hover:bg-purple-800 text-white">
          <Play className="mr-2 h-4 w-4 "/> Play Next
        </Button>
      </div>
      <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Upcoming Songs</h2>
          {queue.map((video)=>(
            <Card key={video.id} className=" bg-gray-900 border-gray-800">
              <CardContent className="p-4 flex items-cneter space-x-4">
                <Image 
                  src={video.smallImg}
                  alt={`thumbnail for ${video.title}`}
                  className="w-30 h-20 object-cover rounded"
                />
                <div className='flex-grow'>
                  <h3 className="font-semibold text-white">{video.title}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={()=>handleVote(video.id,video.haveUpvoted ? false :true )}
                      className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                    >
                      {video.haveUpvoted ? <ThumbsDown className='h-4 w-4'/> : <ThumbsUp className='h-4 w-4'/>}
                      <span>{video.upvotes}</span>
                      </Button></div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      </div>
      <ToastContainer 
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />

    </div>
  )
}




//2:53:00