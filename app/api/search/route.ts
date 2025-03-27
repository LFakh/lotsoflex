import { NextResponse } from "next/server"

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  try {
    const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch search results: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error searching movies:", error)
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 })
  }
}

