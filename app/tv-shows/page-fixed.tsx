import { Navbar } from "@/components/navbar-fixed"
import { Row } from "@/components/row-updated"
import { fetchCategoryData } from "@/lib/fetch-data"

export default async function TvShowsPage() {
  const tvShows = await fetchCategoryData("fetchTvShows")
  const lotsofflexOriginals = await fetchCategoryData("fetchLotsofflexOriginals")

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900/10 to-[#010511]">
      <Navbar />

      <main className="relative pt-24 pb-24 pl-4 lg:pl-16">
        <h1 className="text-3xl font-bold px-4 md:px-0 mb-6">TV Shows</h1>

        <section className="md:space-y-24">
          <Row title="Lotsoflex Originals" movies={lotsofflexOriginals} category="tv" />
          <Row title="Popular TV Shows" movies={tvShows} category="tv" />
        </section>
      </main>
    </div>
  )
}

