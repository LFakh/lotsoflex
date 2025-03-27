"use client"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useAppSelector } from "@/redux/hooks"
import { Play, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/redux/hooks"
import { removeFromMyList } from "@/redux/features/moviesSlice"

export default function MyListPage() {
  const { myList } = useAppSelector((state) => state.movies)
  const dispatch = useAppDispatch()

  const handleRemove = (id: number) => {
    dispatch(removeFromMyList(id))
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900/10 to-[#010511]">
      <Navbar />

      <main className="relative pt-24 px-4 md:px-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">My List</h1>

        {myList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {myList.map((movie) => (
              <div
                key={movie.id}
                className="relative h-64 rounded-sm overflow-hidden transition duration-200 ease-out group"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                  alt={movie.title || movie.name || movie.original_name || ""}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute top-2 right-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full bg-gray-800/60 hover:bg-gray-700/60"
                      onClick={() => handleRemove(movie.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute bottom-0 w-full p-4">
                    <h2 className="text-base md:text-lg font-semibold mb-2">
                      {movie.title || movie.name || movie.original_name}
                    </h2>

                    <div className="flex space-x-2">
                      <Button asChild size="sm" className="bg-white text-black hover:bg-gray-300">
                        <Link href={`/watch/${movie.id}?type=${movie.media_type || "movie"}`}>
                          <Play className="h-3 w-3 text-black mr-1" />
                          Play
                        </Link>
                      </Button>

                      <Button asChild size="sm" variant="outline" className="border-white/40">
                        <Link href={`/${movie.media_type || "movie"}/${movie.id}`}>More Info</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-400 mb-4">Your list is empty.</p>
            <p className="text-gray-500">
              Add movies and TV shows to your list by clicking the + button when browsing.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

