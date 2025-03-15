import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { searchMovies } from '../services/tmdbApi';
import Navbar from '../components/Navbar';

const SearchContainer = styled.div`
  background-color: #111;
  color: white;
  min-height: 100vh;
  padding-top: 100px;
`;

const SearchContent = styled.div`
  padding: 0 60px;
  
  @media (max-width: 768px) {
    padding: 0 30px;
  }
`;

const SearchTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 1.8rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const MovieCard = styled(Link)`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s;
  text-decoration: none;
  color: white;
  
  &:hover {
    transform: scale(1.05);
    z-index: 10;
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 4px;
`;

const MovieInfo = styled.div`
  padding: 10px 0;
`;

const MovieTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MovieYear = styled.p`
  font-size: 0.9rem;
  color: #aaa;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 50px 0;
  font-size: 1.2rem;
`;

function Search() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const response = await searchMovies(query);
        setResults(response.data.results);
      } catch (error) {
        console.error("Error searching movies:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <SearchContainer>
      <Navbar />
      <SearchContent>
        <SearchTitle>
          {loading ? 'Searching...' : `Search results for: "${query}"`}
        </SearchTitle>
        
        {!loading && results.length === 0 && (
          <NoResults>No results found for "{query}"</NoResults>
        )}
        
        <ResultsGrid>
          {results.map(movie => (
            movie.poster_path && (
              <MovieCard key={movie.id} to={`/details/${movie.id}`}>
                <MoviePoster 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                />
                <MovieInfo>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <MovieYear>
                    {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
                  </MovieYear>
                </MovieInfo>
              </MovieCard>
            )
          ))}
        </ResultsGrid>
      </SearchContent>
    </SearchContainer>
  );
}

export default Search;