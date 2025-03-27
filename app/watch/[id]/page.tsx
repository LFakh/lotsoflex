"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { VideoPlayer } from "@/components/video-player"
import { StreamingProviders } from "@/components/streaming-providers"
import { useGetMovieDetailsQuery, useGetTvShowDetailsQuery } from "@/redux/services/tmdbApi"

export default function WatchPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string

  // Get the type from URL or try to determine it
  const [contentType, setContentType] = useState<"movie" | "tv">(
    (searchParams.get("type") as "movie" | "tv") || "movie",
  )

  // Try to fetch both movie and TV data
  const {
    data: movieData,
    isLoading: isLoadingMovie,
    isError: isErrorMovie,
  } = useGetMovieDetailsQuery(id, {
    skip: contentType === "tv",
  })

  const {
    data: tvData,
    isLoading: isLoadingTv,
    isError: isErrorTv,
  } = useGetTvShowDetailsQuery(id, {
    skip: contentType === "movie",
  })

  // Determine the content based on what's available
  const [content, setContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Update content when data changes
  useEffect(() => {
    if (contentType === "movie" && movieData) {
      setContent(movieData)
      setIsLoading(false)
    } else if (contentType === "tv" && tvData) {
      setContent(tvData)
      setIsLoading(false)
    } else if (contentType === "movie" && isErrorMovie && !isLoadingMovie) {
      // If movie fetch fails, try TV
      setContentType("tv")
    } else if (contentType === "tv" && isErrorTv && !isLoadingTv) {
      // If both fail, show error state
      setIsLoading(false)
    }
  }, [movieData, tvData, contentType, isErrorMovie, isErrorTv, isLoadingMovie, isLoadingTv])

  // Get trailer
  const trailer = content?.videos?.results.find((video: any) => video.type === "Trailer" || video.type === "Teaser")

  const trailerKey = trailer?.key

  // Multiple video sources to try
  const videoSources = [
    `https://vidsrc.to/embed/${contentType}/${id}`,
    `https://vidsrc.dev/embed/${contentType}/${id}`,
    `https://2embed.org/embed/${contentType}/${id}`,
    `https://www.2embed.cc/embed/${contentType}/${id}`,
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-pulse">
          <Image src="/lotsoflex-logo.png" alt="Lotsoflex" width={120} height={32} />
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Content not found</p>
          <p className="text-gray-400">We couldn't find this title in our database.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />

      <main className="pt-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="py-8">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-8">{content.title || content.name}</h1>

          <div className="grid gap-6 lg:grid-cols-2">
            <VideoPlayer
              title="Full Content"
              embedUrl={videoSources[0]}
              fallbackEmbedUrl={videoSources[1]}
              autoPlay={true}
            />

            {trailerKey && (
              <VideoPlayer title="Trailer" embedUrl={`https://www.youtube.com/embed/${trailerKey}`} autoPlay={false} />
            )}
          </div>

          <div className="mt-8">
            <StreamingProviders id={id} type={contentType} />
          </div>

          {/* Additional video sources */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Alternative Sources</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {videoSources.slice(2).map((source, index) => (
                <VideoPlayer key={index} title={`Source ${index + 3}`} embedUrl={source} autoPlay={false} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

