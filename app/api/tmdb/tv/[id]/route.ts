import { NextResponse } from "next/server"

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const response = await fetch(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,similar,credits`,
      { next: { revalidate: 60 * 60 } },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch TV show details: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching TV show details:", error)
    return NextResponse.json({ error: "Failed to fetch TV show details" }, { status: 500 })
  }
}

