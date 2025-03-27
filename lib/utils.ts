import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function detectContentType(id: string, apiKey: string): Promise<"movie" | "tv" | null> {
  try {
    // Try as movie first
    const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)

    if (movieResponse.ok) {
      return "movie"
    }

    // Try as TV show
    const tvResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`)

    if (tvResponse.ok) {
      return "tv"
    }

    return null
  } catch (error) {
    console.error("Error detecting content type:", error)
    return null
  }
}

export function getVideoEmbedUrls(id: string, type: "movie" | "tv"): string[] {
  return [
    `https://vidsrc.to/embed/${type}/${id}`,
    `https://vidsrc.dev/embed/${type}/${id}`,
    `https://2embed.org/embed/${type}/${id}`,
    `https://www.2embed.cc/embed/${type}/${id}`,
  ]
}

