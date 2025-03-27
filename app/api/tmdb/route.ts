import { NextResponse } from "next/server"

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: Request) {
  return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 })
}

