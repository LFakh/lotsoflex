"use client"

import Image from "next/image"
import Link from "next/link"
import type { Movie } from "@/types"

interface SearchResultsProps {
  results: Movie[]
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-400">No results found. Try a different search term.</p>
      </div>
    )
  }

  return (
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
            />

            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-4">
              <h2 className="text-sm md:text-base font-semibold truncate">
                {result.title || result.name || result.original_name}
              </h2>
              {(result.release_date || result.first_air_date) && (
                <p className="text-xs text-gray-400">{(result.release_date || result.first_air_date)?.split("-")[0]}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

