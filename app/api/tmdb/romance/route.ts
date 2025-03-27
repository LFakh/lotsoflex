import { NextResponse } from "next/server"

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=10749`, {
      next: { revalidate: 60 * 60 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch romance movies: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data.results)
  } catch (error) {
    console.error("Error fetching romance movies:", error)
    return NextResponse.json({ error: "Failed to fetch romance movies" }, { status: 500 })
  }
}

