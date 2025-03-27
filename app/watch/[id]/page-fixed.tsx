import { fetchMovieDetails } from "@/lib/requests-fixed"
import { Navbar } from "@/components/navbar-updated"
import { VideoPlayer } from "@/components/video-player"
import { StreamingProviders } from "@/components/streaming-providers-fixed"

interface WatchPageProps {
  params: {
    id: string
  }
  searchParams: {
    type?: string
  }
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const type = searchParams.type || "movie"
  const content = await fetchMovieDetails(params.id, type as "movie" | "tv")

  // Get trailer
  const trailer = content.videos?.results.find((video: any) => video.type === "Trailer" || video.type === "Teaser")

  const trailerKey = trailer?.key

  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />

      <main className="pt-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="py-8">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-8">{content.title || content.name}</h1>

          <div className="grid gap-6 lg:grid-cols-2">
            <VideoPlayer title="Full Content" embedUrl={`https://vidsrc.to/embed/${type}/${params.id}`} />

            {trailerKey && <VideoPlayer title="Trailer" embedUrl={`https://www.youtube.com/embed/${trailerKey}`} />}
          </div>

          <div className="mt-8">
            <StreamingProviders id={params.id} type={type as "movie" | "tv"} />
          </div>
        </div>
      </main>
    </div>
  )
}

