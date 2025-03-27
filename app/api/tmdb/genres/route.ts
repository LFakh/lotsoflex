import { NextResponse } from "next/server"

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export async function GET() {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
      { next: { revalidate: 60 * 60 * 24 } }, // Revalidate every day
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch genres: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data.genres)
  } catch (error) {
    console.error("Error fetching genres:", error)
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 })
  }
}

