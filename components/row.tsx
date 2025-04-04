"use client"

import type React from "react"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Plus, Check, Play } from "lucide-react"
import type { Movie } from "@/types"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addToMyList, removeFromMyList } from "@/redux/features/moviesSlice"
import { Button } from "@/components/ui/button"

interface RowProps {
  title: string
  movies: Movie[]
  category?: string
}

export function Row({ title, movies, category = "movie" }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [isMoved, setIsMoved] = useState(false)
  const dispatch = useAppDispatch()
  const { myList } = useAppSelector((state) => state.movies)

  const handleClick = (direction: "left" | "right") => {
    setIsMoved(true)

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current

      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  const handleMyList = (movie: Movie, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const isInMyList = myList.some((m) => m.id === movie.id)

    if (isInMyList) {
      dispatch(removeFromMyList(movie.id))
    } else {
      dispatch(addToMyList(movie))
    }
  }

  return (
    <div className="h-40 space-y-0.5 md:space-y-2 px-4 md:px-0">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-white transition duration-200 hover:text-gray-300 md:text-xl">
        {title}
      </h2>
      <div className="group relative md:-ml-2">
        <ChevronLeft
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${
            !isMoved && "hidden"
          }`}
          onClick={() => handleClick("left")}
        />

        <div
          ref={rowRef}
          className="flex items-center space-x-0.5 overflow-x-scroll scrollbar-hide md:space-x-2.5 md:p-2"
        >
          {movies.map((movie) => {
            const isInMyList = myList.some((m) => m.id === movie.id)

            return (
              <div
                key={movie.id}
                className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105 group"
              >
                <Link href={`/${category}/${movie.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View {movie.title || movie.name}</span>
                </Link>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                  alt={movie.title || movie.name || movie.original_name || ""}
                  fill
                  className="rounded-sm object-cover md:rounded"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-20">
                    <Link
                      href={`/watch/${movie.id}?type=${category}`}
                      className="bg-white text-black rounded-full p-1 hover:bg-gray-300"
                    >
                      <Play className="h-4 w-4" />
                    </Link>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full bg-gray-800/60 hover:bg-gray-700/60"
                      onClick={(e) => handleMyList(movie, e)}
                    >
                      {isInMyList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <ChevronRight
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  )
}

