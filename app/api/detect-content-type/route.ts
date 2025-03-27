import { NextResponse } from "next/server"
import { detectContentType } from "@/lib/utils"

const API_KEY = process.env.TMDB_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
  }

  try {
    const contentType = await detectContentType(id, API_KEY as string)

    if (!contentType) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({ type: contentType })
  } catch (error) {
    console.error("Error detecting content type:", error)
    return NextResponse.json({ error: "Failed to detect content type" }, { status: 500 })
  }
}

