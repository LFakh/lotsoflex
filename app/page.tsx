"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Banner } from "@/components/banner"
import { Row } from "@/components/row"
import { useAppDispatch } from "@/redux/hooks"
import { setFeatured } from "@/redux/features/moviesSlice"
import {
  useGetNetflixOriginalsQuery,
  useGetTrendingQuery,
  useGetTopRatedQuery,
  useGetActionMoviesQuery,
  useGetComedyMoviesQuery,
  useGetHorrorMoviesQuery,
  useGetRomanceMoviesQuery,
  useGetDocumentariesQuery,
} from "@/redux/services/tmdbApi"

export default function Home() {
  const dispatch = useAppDispatch()

  const { data: lotsofflexOriginals, isLoading: isLoadingOriginals } = useGetNetflixOriginalsQuery()
  const { data: trending, isLoading: isLoadingTrending } = useGetTrendingQuery()
  const { data: topRated, isLoading: isLoadingTopRated } = useGetTopRatedQuery()
  const { data: actionMovies, isLoading: isLoadingAction } = useGetActionMoviesQuery()
  const { data: comedyMovies, isLoading: isLoadingComedy } = useGetComedyMoviesQuery()
  const { data: horrorMovies, isLoading: isLoadingHorror } = useGetHorrorMoviesQuery()
  const { data: romanceMovies, isLoading: isLoadingRomance } = useGetRomanceMoviesQuery()
  const { data: documentaries, isLoading: isLoadingDocs } = useGetDocumentariesQuery()

  const isLoading =
    isLoadingOriginals ||
    isLoadingTrending ||
    isLoadingTopRated ||
    isLoadingAction ||
    isLoadingComedy ||
    isLoadingHorror ||
    isLoadingRomance ||
    isLoadingDocs

  useEffect(() => {
    if (lotsofflexOriginals && lotsofflexOriginals.length > 0) {
      const randomMovie = lotsofflexOriginals[Math.floor(Math.random() * lotsofflexOriginals.length)]
      dispatch(setFeatured(randomMovie))
    }
  }, [lotsofflexOriginals, dispatch])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-pulse">
          <Image src="/lotsoflex-logo.png" alt="Lotsoflex" width={120} height={32} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen bg-gradient-to-b from-gray-900/10 to-[#010511] lg:h-[140vh]">
      <Navbar />
      <main className="relative pb-24 pl-4 lg:pl-16">
        <Banner movies={lotsofflexOriginals || []} />
        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trending || []} />
          <Row title="Top Rated" movies={topRated || []} />
          <Row title="Action Thrillers" movies={actionMovies || []} category="movie" />
          <Row title="Comedies" movies={comedyMovies || []} category="movie" />
          <Row title="Scary Movies" movies={horrorMovies || []} category="movie" />
          <Row title="Romance Movies" movies={romanceMovies || []} category="movie" />
          <Row title="Documentaries" movies={documentaries || []} category="movie" />
        </section>
      </main>
    </div>
  )
}

