import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar-updated"
import { Button } from "@/components/ui/button"
import { fetchMovieDetails } from "@/lib/requests"
import { Play, Plus, ThumbsUp } from "lucide-react"

interface MoviePageProps {
  params: {
    id: string
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movie = await fetchMovieDetails(params.id, "movie")

  // Format runtime to hours and minutes
  const hours = Math.floor(movie.runtime / 60)
  const minutes = movie.runtime % 60

  // Get trailer
  const trailer = movie.videos?.results.find((video: any) => video.type === "Trailer" || video.type === "Teaser")

  // Get director
  const director = movie.credits?.crew.find((person: any) => person.job === "Director")

  // Get cast (top 5)
  const cast = movie.credits?.cast.slice(0, 5)

  return (
    <div className="relative h-screen bg-gradient-to-b from-gray-900/10 to-[#010511]">
      <Navbar />

      <main className="relative pt-16">
        <div className="relative h-[70vh]">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
            alt={movie.title || "Movie"}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent h-1/2" />
        </div>

        <div className="px-4 md:px-16 pb-24 -mt-32 relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold">{movie.title}</h1>

          <div className="flex items-center space-x-4 mt-4">
            <p className="text-green-500 font-semibold">{Math.round(movie.vote_average * 10)}% Match</p>
            <p className="text-gray-400">{movie.release_date?.split("-")[0]}</p>
            {movie.runtime > 0 && (
              <p className="text-gray-400">
                {hours}h {minutes}m
              </p>
            )}
            <span className="border border-white/40 px-2 text-xs">HD</span>
          </div>

          <div className="flex space-x-4 mt-6">
            <Link href={`/watch/${params.id}?type=movie`}>
              <Button className="bg-white text-black hover:bg-gray-300">
                <Play className="h-4 w-4 text-black mr-2" />
                Play
              </Button>
            </Link>
            <Button variant="outline" className="border-white/40">
              <Plus className="h-4 w-4 mr-2" />
              My List
            </Button>
            <Button variant="outline" className="border-white/40">
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="text-lg">{movie.overview}</p>

            <div className="mt-6 text-gray-400">
              {director && (
                <p>
                  <span className="text-gray-200">Director:</span> {director.name}
                </p>
              )}

              {cast && cast.length > 0 && (
                <p className="mt-2">
                  <span className="text-gray-200">Cast:</span> {cast.map((person: any) => person.name).join(", ")}
                </p>
              )}

              {movie.genres && (
                <p className="mt-2">
                  <span className="text-gray-200">Genres:</span>{" "}
                  {movie.genres.map((genre: any) => genre.name).join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

