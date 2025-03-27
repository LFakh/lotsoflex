import { Navbar } from "@/components/navbar-updated"
import { Banner } from "@/components/banner"
import { Row } from "@/components/row-updated"
import { fetchCategoryData } from "@/lib/fetch-data"

export default async function Home() {
  const [
    lotsofflexOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetchCategoryData("fetchLotsofflexOriginals"),
    fetchCategoryData("fetchTrending"),
    fetchCategoryData("fetchTopRated"),
    fetchCategoryData("fetchActionMovies"),
    fetchCategoryData("fetchComedyMovies"),
    fetchCategoryData("fetchHorrorMovies"),
    fetchCategoryData("fetchRomanceMovies"),
    fetchCategoryData("fetchDocumentaries"),
  ])

  return (
    <div className="relative h-screen bg-gradient-to-b from-gray-900/10 to-[#010511] lg:h-[140vh]">
      <Navbar />
      <main className="relative pb-24 pl-4 lg:pl-16">
        <Banner netflixOriginals={lotsofflexOriginals} />
        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
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

