import { NextResponse } from "next/server"

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const type = searchParams.get("type") || "movie"

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
  }

  try {
    const response = await fetch(`${BASE_URL}/${type}/${id}/watch/providers?api_key=${API_KEY}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch providers: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching streaming providers:", error)
    return NextResponse.json({ error: "Failed to fetch streaming providers" }, { status: 500 })
  }
}

