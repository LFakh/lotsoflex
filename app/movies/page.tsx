import { Navbar } from "@/components/navbar-updated"
import { Row } from "@/components/row"
import { fetchCategoryData } from "@/lib/fetch-data"

export default async function MoviesPage() {
  const [topRated, actionMovies, comedyMovies, horrorMovies, romanceMovies, documentaries] = await Promise.all([
    fetchCategoryData("fetchTopRated"),
    fetchCategoryData("fetchActionMovies"),
    fetchCategoryData("fetchComedyMovies"),
    fetchCategoryData("fetchHorrorMovies"),
    fetchCategoryData("fetchRomanceMovies"),
    fetchCategoryData("fetchDocumentaries"),
  ])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900/10 to-[#010511]">
      <Navbar />

      <main className="relative pt-24 pb-24 pl-4 lg:pl-16">
        <h1 className="text-3xl font-bold px-4 md:px-0 mb-6">Movies</h1>

        <section className="md:space-y-24">
          <Row title="Top Rated" movies={topRated} category="movie" />
          <Row title="Action Thrillers" movies={actionMovies} category="movie" />
          <Row title="Comedies" movies={comedyMovies} category="movie" />
          <Row title="Scary Movies" movies={horrorMovies} category="movie" />
          <Row title="Romance Movies" movies={romanceMovies} category="movie" />
          <Row title="Documentaries" movies={documentaries} category="movie" />
        </section>
      </main>
    </div>
  )
}

