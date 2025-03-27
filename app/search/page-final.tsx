import { Suspense } from "react"
import { Navbar } from "@/components/navbar-fixed"
import SearchResults from "./search-results-fixed"

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  let results = { results: [] }

  if (query) {
    const res = await fetch(
      `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/search?q=${encodeURIComponent(query)}`,
      {
        cache: "no-store",
      },
    )
    results = await res.json()
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900/10 to-[#010511]">
      <Navbar />

      <main className="relative pt-24 px-4 md:px-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          {query ? `Search results for: "${query}"` : "Search for movies and TV shows"}
        </h1>

        <Suspense fallback={<div>Loading...</div>}>
          <SearchResults results={results.results} />
        </Suspense>
      </main>
    </div>
  )
}

