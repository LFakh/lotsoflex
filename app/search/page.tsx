"use client"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useSearchMoviesQuery } from "@/redux/services/tmdbApi"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { data: results, isLoading } = useSearchMoviesQuery(query, { skip: !query })

  if (!query) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900/10 to-[#010511]">
        <Navbar />

        <main className="relative pt-24 px-4 md:px-16">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Search for movies and TV shows</h1>

          <p className="text-gray-400">Enter a search term in the search box above to find movies and TV shows.</p>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900/10 to-[#010511]">
        <Navbar />

        <main className="relative pt-24 px-4 md:px-16">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Searching for: "{query}"</h1>

          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900/10 to-[#010511]">
      <Navbar />

      <main className="relative pt-24 px-4 md:px-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Search results for: "{query}"</h1>

        {results && results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {results.map((result) => {
              // Skip results without images
              if (!result.backdrop_path && !result.poster_path) return null

              const mediaType = result.media_type || "movie"

              return (
                <Link
                  key={result.id}
                  href={`/${mediaType}/${result.id}`}
                  className="relative h-48 md:h-64 rounded-sm overflow-hidden transition duration-200 ease-out md:hover:scale-105"
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${result.backdrop_path || result.poster_path}`}
                    alt={result.title || result.name || result.original_name || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                    <h2 className="text-sm md:text-base font-semibold truncate">
                      {result.title || result.name || result.original_name}
                    </h2>
                    {(result.release_date || result.first_air_date) && (
                      <p className="text-xs text-gray-400">
                        {(result.release_date || result.first_air_date)?.split("-")[0]}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-400">No results found. Try a different search term.</p>
          </div>
        )}
      </main>
    </div>
  )
}

