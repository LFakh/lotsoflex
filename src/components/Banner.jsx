import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchNetflixOriginals } from '../services/tmdbApi';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';

const BannerContainer = styled.header`
  position: relative;
  color: white;
  object-fit: contain;
  height: 448px;
  margin-bottom: 20px;

  @media (min-width: 1500px) {
    height: 600px;
  }
`;

const BannerContent = styled.div`
  margin-left: 30px;
  padding-top: 140px;
  height: 190px;
  z-index: 10;
  position: relative;

  @media (min-width: 1500px) {
    padding-top: 200px;
  }
`;

const BannerTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  padding-bottom: 0.3rem;
  max-width: 70%;

  @media (max-width: 768px) {
    font-size: 2rem;
    max-width: 100%;
  }
`;

const BannerDescription = styled.h2`
  width: 45rem;
  line-height: 1.3;
  padding-top: 1rem;
  font-size: 0.9rem;
  max-width: 70%;
  height: 80px;
  font-weight: 500;

  @media (max-width: 768px) {
    width: auto;
    max-width: 100%;
  }
`;

const BannerButtons = styled.div`
  display: flex;
  margin-top: 20px;
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 4px;
  padding: 0.5rem 2rem;
  margin-right: 1rem;
  text-decoration: none;
  
  &:hover {
    opacity: 0.85;
    transition: all 0.2s;
  }
`;

const PlayButton = styled(Button)`
  background-color: white;
  color: black;
`;

const InfoButton = styled(Button)`
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
`;

const ButtonIcon = styled.span`
  margin-right: 8px;
`;

const BannerFadeBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 7.4rem;
  background-image: linear-gradient(
    180deg,
    transparent,
    rgba(37, 37, 37, 0.61),
    #111
  );
`;

const BannerBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-image: ${props => `url("https://image.tmdb.org/t/p/original/${props.backdrop}")`};
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
`;

function Banner() {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchNetflixOriginals();
        const results = response.data.results;
        setMovie(
          results[Math.floor(Math.random() * results.length)]
        );
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    }
    
    fetchData();
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  if (!movie) return <div>Loading...</div>;

  return (
    <BannerContainer>
      <BannerBackground backdrop={movie?.backdrop_path} />
      <BannerContent>
        <BannerTitle>
          {movie?.title || movie?.name || movie?.original_name}
        </BannerTitle>
        <BannerDescription>
          {truncate(movie?.overview, 150)}
        </BannerDescription>
        <BannerButtons>
          <PlayButton to={`/watch/${movie?.id}`}>
            <ButtonIcon><FaPlay /></ButtonIcon> Play
          </PlayButton>
          <InfoButton to={`/details/${movie?.id}`}>
            <ButtonIcon><FaInfoCircle /></ButtonIcon> More Info
          </InfoButton>
        </BannerButtons>
      </BannerContent>
      <BannerFadeBottom />
    </BannerContainer>
  );
}

export default Banner;