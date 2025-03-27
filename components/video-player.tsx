"use client"

import { useState, useEffect, useRef } from "react"
import { Maximize, Minimize, Volume2, VolumeX, Pause, Play, Rewind, FastForward } from "lucide-react"

interface VideoPlayerProps {
  title: string
  embedUrl: string
  fallbackEmbedUrl?: string
  autoPlay?: boolean
}

export function VideoPlayer({ title, embedUrl, fallbackEmbedUrl, autoPlay = true }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentUrl, setCurrentUrl] = useState(embedUrl)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Try fallback URL if main URL fails
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading && fallbackEmbedUrl && fallbackEmbedUrl !== embedUrl) {
        console.log("Trying fallback URL:", fallbackEmbedUrl)
        setCurrentUrl(fallbackEmbedUrl)
      }
    }, 5000) // Wait 5 seconds before trying fallback

    return () => clearTimeout(timer)
  }, [isLoading, fallbackEmbedUrl, embedUrl])

  // Reset loading state when URL changes
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [currentUrl])

  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Handle iframe error events
  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)

    // Try fallback immediately on error
    if (fallbackEmbedUrl && fallbackEmbedUrl !== currentUrl) {
      setCurrentUrl(fallbackEmbedUrl)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        ;(containerRef.current as any).webkitRequestFullscreen()
      } else if ((containerRef.current as any).msRequestFullscreen) {
        ;(containerRef.current as any).msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        ;(document as any).webkitExitFullscreen()
      } else if ((document as any).msExitFullscreen) {
        ;(document as any).msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // This is a mock implementation since we can't directly control iframe content
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // In a real implementation, you would use postMessage to control the iframe player
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // In a real implementation, you would use postMessage to control the iframe player
  }

  const handleRewind = () => {
    // In a real implementation, you would use postMessage to control the iframe player
    setProgress(Math.max(0, progress - 10))
  }

  const handleFastForward = () => {
    // In a real implementation, you would use postMessage to control the iframe player
    setProgress(Math.min(duration, progress + 10))
  }

  // Mock progress update
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= duration) {
          clearInterval(interval)
          setIsPlaying(false)
          return duration
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, duration])

  // Set mock duration
  useEffect(() => {
    setDuration(120) // 2 minutes mock duration
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div ref={containerRef} className="bg-gray-900 rounded-lg overflow-hidden relative group">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-3">
        <h2 className="text-lg font-medium">{title}</h2>
        <button
          onClick={toggleFullscreen}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>

      <div className="relative pt-[56.25%]">
        {" "}
        {/* 16:9 Aspect Ratio */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        )}
        {hasError && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center p-4">
              <p className="text-lg font-semibold text-red-500 mb-2">Content Unavailable</p>
              <p className="text-sm text-gray-400">
                This media is currently unavailable. Please try again later or check another source.
              </p>
            </div>
          </div>
        )}
        <iframe
          ref={videoRef}
          src={`${currentUrl}${autoPlay ? "?autoplay=1" : ""}`}
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={title}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        ></iframe>
        {/* Custom controls overlay - Note: These won't actually control the iframe content */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-col space-y-2">
            <div className="w-full bg-gray-600 rounded-full h-1 overflow-hidden">
              <div className="bg-red-600 h-1" style={{ width: `${(progress / duration) * 100}%` }}></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button onClick={togglePlay} className="text-white hover:text-gray-300 transition-colors">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button onClick={handleRewind} className="text-white hover:text-gray-300 transition-colors">
                  <Rewind size={20} />
                </button>

                <button onClick={handleFastForward} className="text-white hover:text-gray-300 transition-colors">
                  <FastForward size={20} />
                </button>

                <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <span className="text-sm text-white">
                  {formatTime(progress)} / {formatTime(duration)}
                </span>
              </div>

              <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition-colors">
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

