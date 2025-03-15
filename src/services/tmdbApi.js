import axios from 'axios';

// Create a base axios instance for TMDB API
const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

// API endpoints
export const fetchTrending = () => tmdbApi.get('/trending/all/week');
export const fetchNetflixOriginals = () => tmdbApi.get('/discover/tv?with_networks=213');
export const fetchTopRated = () => tmdbApi.get('/movie/top_rated');
export const fetchActionMovies = () => tmdbApi.get('/discover/movie?with_genres=28');
export const fetchComedyMovies = () => tmdbApi.get('/discover/movie?with_genres=35');
export const fetchHorrorMovies = () => tmdbApi.get('/discover/movie?with_genres=27');
export const fetchRomanceMovies = () => tmdbApi.get('/discover/movie?with_genres=10749');
export const fetchDocumentaries = () => tmdbApi.get('/discover/movie?with_genres=99');
export const fetchMovieDetails = (id) => tmdbApi.get(`/movie/${id}`);
export const fetchTvDetails = (id) => tmdbApi.get(`/tv/${id}`);
export const searchMovies = (query) => tmdbApi.get(`/search/movie?query=${query}`);

export default tmdbApi;