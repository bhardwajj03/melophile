"use client"

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Share2 } from 'lucide-react'
import Image from "next/image"
import YouTube from 'react-youtube'

interface Video {
  id: string;
  title: string;
  upvotes: number;
  downvotes: number;
  thumbnail: string;
}

export default function Component() {
  const [inputLink, setInputLink] = useState('')
  const [queue, setQueue] = useState<Video[]>([
    {id:'1', title:'Awesome Song 1', upvotes:5, downvotes:0, thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg'},
    {id:'2', title:'Cool Video', upvotes:3, downvotes:1, thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/0.jpg'},
    {id:'3', title:'Mobile Videos', upvotes:1, downvotes:6, thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/0.jpg'},
  ])
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null)

  useEffect(() => {
    if (!currentVideo && queue.length > 0) {
      setCurrentVideo(queue[0])
      setQueue(prev => prev.slice(1))
    }
  }, [currentVideo, queue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLink(e.target.value)
    if (e.target.value.includes('youtube.com') || e.target.value.includes('youtu.be')) {
      const videoId = e.target.value.split('v=')[1] || e.target.value.split('/').pop()
      setPreviewVideo({
        id: videoId || '',
        title: 'Video Title', // You'd get this from the YouTube API in a real app
        upvotes: 0,
        downvotes: 0,
        thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`
      })
    } else {
      setPreviewVideo(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (previewVideo) {
      setQueue(prev => [...prev, previewVideo])
      setInputLink('')
      setPreviewVideo(null)
    }
  }

  const handleVote = (index: number, isUpvote: boolean) => {
    setQueue(prev => 
      prev.map((video, i) => 
        i === index 
          ? { 
              ...video, 
              upvotes: isUpvote ? video.upvotes + 1 : video.upvotes,
              downvotes: !isUpvote ? video.downvotes + 1 : video.downvotes
            } 
          : video
      ).sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Stream Song Voter',
          text: 'Vote for the next song on my stream!',
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      alert('Web Share API is not supported in your browser. You can copy the URL to share.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-900 to-black text-white">
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-purple-300">Stream Song Voter</h1>
          <Button onClick={handleShare} className="bg-purple-600 hover:bg-purple-700">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <Card className="bg-purple-800 border-purple-600 overflow-hidden mb-6">
          {/* Current playing video */}
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-2 text-purple-300">Now Playing</h2>
            {currentVideo ? (
              <div className="aspect-video">
                <YouTube videoId={currentVideo.id} opts={{ height: '100%', width: '100%' }} />
              </div>
            ) : (
              <p>No video currently playing</p>
            )}
          </div>

          {/* Video submission form */}
          <div className="bg-purple-900 p-4">
            <h2 className="text-2xl font-semibold mb-2 text-purple-300">Submit a Song</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={inputLink}
                  onChange={handleInputChange}
                  placeholder="Paste YouTube video URL"
                  className="flex-grow bg-purple-800 text-white border-purple-700 placeholder-purple-400"
                />
                <Button type="submit" disabled={!previewVideo} className="bg-purple-600 hover:bg-purple-700">
                  Submit
                </Button>
              </div>
              {previewVideo && (
                <div className="flex items-center gap-4 p-2 bg-purple-800 rounded">
                  <Image src={previewVideo.thumbnail || "/placeholder.svg"} alt={previewVideo.title} width={80} height={60} className="rounded" />
                  <div>
                    <h3 className="font-semibold text-white">{previewVideo.title}</h3>
                    <p className="text-sm text-purple-300">Click submit to add to queue</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </Card>

        {/* Video queue */}
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-purple-300">Up Next</h2>
          {queue.map((video, index) => (
            <Card key={video.id} className="mb-2 bg-purple-800 border-purple-600">
              <CardContent className="flex items-center gap-4 p-4">
                <Image src={video.thumbnail || "/placeholder.svg"} alt={video.title} width={120} height={90} className="rounded" />
                <div className="flex-grow">
                  <h3 className="font-semibold text-white">{video.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleVote(index, true)}
                    className="border-purple-500 hover:bg-purple-700"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold text-purple-300 bg-purple-900 px-2 py-1 rounded">{video.upvotes}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleVote(index, false)}
                    className="border-purple-500 hover:bg-purple-700"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold text-purple-300 bg-purple-900 px-2 py-1 rounded">{video.downvotes}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

