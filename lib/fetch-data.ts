import { requests } from "./requests"
import type { Movie } from "@/types"

export async function fetchCategoryData(category: string): Promise<Movie[]> {
  const url = (requests as any)[category]
  if (!url) return []

  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 } }) // Revalidate every hour
    if (!res.ok) throw new Error(`Failed to fetch ${category}`)

    const data = await res.json()
    return data.results || []
  } catch (error) {
    console.error(`Error fetching ${category}:`, error)
    return []
  }
}

