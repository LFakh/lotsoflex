import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { fetchMovieDetails } from "@/lib/requests"
import { Play, Plus, ThumbsUp } from "lucide-react"

interface TvShowPageProps {
  params: {
    id: string
  }
}

export default async function TvShowPage({ params }: TvShowPageProps) {
  const show = await fetchMovieDetails(params.id, "tv")

  // Get trailer
  const trailer = show.videos?.results.find((video: any) => video.type === "Trailer" || video.type === "Teaser")

  // Get creator
  const creator = show.created_by?.[0]

  // Get cast (top 5)
  const cast = show.credits?.cast.slice(0, 5)

  return (
    <div className="relative h-screen bg-gradient-to-b from-gray-900/10 to-[#010511]">
      <Navbar />

      <main className="relative pt-16">
        <div className="relative h-[70vh]">
          <Image
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path || show.poster_path}`}
            alt={show.name || "TV Show"}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent h-1/2" />
        </div>

        <div className="px-4 md:px-16 pb-24 -mt-32 relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold">{show.name}</h1>

          <div className="flex items-center space-x-4 mt-4">
            <p className="text-green-500 font-semibold">{Math.round(show.vote_average * 10)}% Match</p>
            <p className="text-gray-400">{show.first_air_date?.split("-")[0]}</p>
            <p className="text-gray-400">
              {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? "s" : ""}
            </p>
            <span className="border border-white/40 px-2 text-xs">HD</span>
          </div>

          <div className="flex space-x-4 mt-6">
            <Button className="bg-white text-black hover:bg-gray-300">
              <Play className="h-4 w-4 text-black mr-2" />
              Play
            </Button>
            <Button variant="outline" className="border-white/40">
              <Plus className="h-4 w-4 mr-2" />
              My List
            </Button>
            <Button variant="outline" className="border-white/40">
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="text-lg">{show.overview}</p>

            <div className="mt-6 text-gray-400">
              {creator && (
                <p>
                  <span className="text-gray-200">Creator:</span> {creator.name}
                </p>
              )}

              {cast && cast.length > 0 && (
                <p className="mt-2">
                  <span className="text-gray-200">Cast:</span> {cast.map((person: any) => person.name).join(", ")}
                </p>
              )}

              {show.genres && (
                <p className="mt-2">
                  <span className="text-gray-200">Genres:</span>{" "}
                  {show.genres.map((genre: any) => genre.name).join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

