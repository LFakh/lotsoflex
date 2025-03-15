import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RowContainer = styled.div`
  margin-left: 20px;
  margin-bottom: 20px;
  position: relative;
`;

const RowTitle = styled.h2`
  color: white;
  margin-left: 10px;
`;

const RowPosters = styled.div`
  display: flex;
  overflow-y: hidden;
  overflow-x: scroll;
  padding: 20px 10px;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PosterContainer = styled(Link)`
  position: relative;
  transition: transform 450ms;
  margin-right: 10px;
  
  &:hover {
    transform: scale(1.08);
    z-index: 10;
  }
`;

const Poster = styled.img`
  object-fit: contain;
  width: ${props => props.isLargeRow ? "200px" : "150px"};
  max-height: ${props => props.isLargeRow ? "300px" : "200px"};
  transition: transform 450ms;
  border-radius: 4px;
  
  @media (max-width: 768px) {
    width: ${props => props.isLargeRow ? "150px" : "120px"};
    max-height: ${props => props.isLargeRow ? "225px" : "160px"};
  }
`;

const SliderButton = styled.button`
  position: absolute;
  top: 50%;
  z-index: 10;
  height: 100%;
  width: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  
  ${RowContainer}:hover & {
    opacity: 1;
  }
`;

const LeftButton = styled(SliderButton)`
  left: 0;
`;

const RightButton = styled(SliderButton)`
  right: 0;
`;

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchUrl();
        setMovies(response.data.results);
        return response;
      } catch (error) {
        console.error(`Error fetching row data for ${title}:`, error);
      }
    }
    
    fetchData();
  }, [fetchUrl, title]);

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollLeft -= rowRef.current.offsetWidth - 100;
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollLeft += rowRef.current.offsetWidth - 100;
    }
  };

  return (
    <RowContainer>
      <RowTitle>{title}</RowTitle>
      
      <LeftButton onClick={scrollLeft}>
        <FaChevronLeft />
      </LeftButton>
      
      <RowPosters ref={rowRef}>
        {movies.map(
          (movie) =>
            ((isLargeRow && movie.poster_path) ||
              (!isLargeRow && movie.backdrop_path)) && (
              <PosterContainer 
                key={movie.id}
                to={`/details/${movie.id}`}
              >
                <Poster
                  isLargeRow={isLargeRow}
                  src={`https://image.tmdb.org/t/p/original/${
                    isLargeRow ? movie.poster_path : movie.backdrop_path
                  }`}
                  alt={movie.name}
                />
              </PosterContainer>
            )
        )}
      </RowPosters>
      
      <RightButton onClick={scrollRight}>
        <FaChevronRight />
      </RightButton>
    </RowContainer>
  );
}

export default Row;