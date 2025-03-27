import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Movie, Genre, MovieDetails, TvShowDetails } from "@/types"

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/tmdb",
  }),
  endpoints: (builder) => ({
    getTrending: builder.query<Movie[], void>({
      query: () => "trending",
    }),
    getNetflixOriginals: builder.query<Movie[], void>({
      query: () => "lotsoflex-originals",
    }),
    getTopRated: builder.query<Movie[], void>({
      query: () => "top-rated",
    }),
    getActionMovies: builder.query<Movie[], void>({
      query: () => "action",
    }),
    getComedyMovies: builder.query<Movie[], void>({
      query: () => "comedy",
    }),
    getHorrorMovies: builder.query<Movie[], void>({
      query: () => "horror",
    }),
    getRomanceMovies: builder.query<Movie[], void>({
      query: () => "romance",
    }),
    getDocumentaries: builder.query<Movie[], void>({
      query: () => "documentaries",
    }),
    getMovieDetails: builder.query<MovieDetails, string>({
      query: (id) => `movie/${id}`,
    }),
    getTvShowDetails: builder.query<TvShowDetails, string>({
      query: (id) => `tv/${id}`,
    }),
    searchMovies: builder.query<Movie[], string>({
      query: (query) => `search?q=${query}`,
    }),
    getGenres: builder.query<Genre[], void>({
      query: () => "genres",
    }),
    getMoviesByGenre: builder.query<Movie[], number>({
      query: (genreId) => `genre/${genreId}`,
    }),
  }),
})

export const {
  useGetTrendingQuery,
  useGetNetflixOriginalsQuery,
  useGetTopRatedQuery,
  useGetActionMoviesQuery,
  useGetComedyMoviesQuery,
  useGetHorrorMoviesQuery,
  useGetRomanceMoviesQuery,
  useGetDocumentariesQuery,
  useGetMovieDetailsQuery,
  useGetTvShowDetailsQuery,
  useSearchMoviesQuery,
  useGetGenresQuery,
  useGetMoviesByGenreQuery,
} = tmdbApi

