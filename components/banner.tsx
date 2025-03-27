"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Info, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/types"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addToMyList, removeFromMyList } from "@/redux/features/moviesSlice"

interface BannerProps {
  movies: Movie[]
}

export function Banner({ movies }: BannerProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const dispatch = useAppDispatch()
  const { myList } = useAppSelector((state) => state.movies)
  const isInMyList = movie ? myList.some((m) => m.id === movie.id) : false

  useEffect(() => {
    if (movies && movies.length > 0) {
      setMovie(movies[Math.floor(Math.random() * movies.length)])
    }
  }, [movies])

  const handleMyList = () => {
    if (!movie) return

    if (isInMyList) {
      dispatch(removeFromMyList(movie.id))
    } else {
      dispatch(addToMyList(movie))
    }
  }

  if (!movie) return null

  return (
    <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12">
      <div className="absolute top-0 left-0 -z-10 h-[95vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path || movie?.poster_path}`}
          alt={movie?.title || movie?.name || movie?.original_name || ""}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
      </div>

      <div className="pt-24 md:pt-32 lg:pt-48 px-4 md:px-8 space-y-4 md:space-y-6 max-w-xl">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-shadow-md">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <p className="text-shadow-md max-w-xs text-xs md:max-w-lg md:text-sm lg:max-w-2xl lg:text-base">
          {movie?.overview}
        </p>
        <div className="flex space-x-3">
          <Button asChild className="bg-white text-black hover:bg-gray-300">
            <Link href={`/watch/${movie.id}?type=${movie.media_type || "movie"}`}>
              <Play className="h-4 w-4 text-black mr-2" />
              Play
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-gray-500/70">
            <Link href={`/${movie.media_type || "movie"}/${movie.id}`}>
              <Info className="h-4 w-4 mr-2" />
              More Info
            </Link>
          </Button>
          <Button variant="outline" className="bg-gray-500/70" onClick={handleMyList}>
            {isInMyList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

