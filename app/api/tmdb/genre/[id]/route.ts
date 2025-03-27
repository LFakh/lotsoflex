import { NextResponse } from "next/server"

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${id}`, {
      next: { revalidate: 60 * 60 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch movies by genre: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data.results)
  } catch (error) {
    console.error("Error fetching movies by genre:", error)
    return NextResponse.json({ error: "Failed to fetch movies by genre" }, { status: 500 })
  }
}

