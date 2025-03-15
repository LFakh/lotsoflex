import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchMovieDetails, fetchTvDetails } from '../services/tmdbApi';
import Navbar from '../components/Navbar';
import { FaPlay, FaPlus, FaThumbsUp } from 'react-icons/fa';

const DetailsContainer = styled.div`
  position: relative;
  background-color: #111;
  color: white;
  min-height: 100vh;
`;

const BackdropContainer = styled.div`
  position: relative;
  height: 70vh;
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
    background: linear-gradient(
      to bottom,
      rgba(17, 17, 17, 0) 0%,
      rgba(17, 17, 17, 0.8) 80%,
      rgba(17, 17, 17, 1) 100%
    );
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  padding: 0 5%;
  margin-top: -150px;
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: -100px;
  }
`;

const PosterContainer = styled.div`
  flex: 0 0 300px;
  margin-right: 40px;
  
  @media (max-width: 768px) {
    flex: 0 0 auto;
    margin-right: 0;
    margin-bottom: 20px;
    text-align: center;
  }
`;

const Poster = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    width: 70%;
  }
`;

const DetailsContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Metadata = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  margin-right: 15px;
  color: #aaa;
`;

const Rating = styled.span`
  color: ${props => props.score > 7 ? '#46d369' : props.score > 5 ? '#ffb43a' : '#e6464c'};
  font-weight: bold;
`;

const Overview = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 30px;
  max-width: 800px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  margin-right: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &:hover {
    opacity: 0.85;
  }
`;

const PlayButton = styled(Button)`
  background-color: white;
  color: black;
`;

const SecondaryButton = styled(Button)`
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
`;

const ButtonIcon = styled.span`
  margin-right: 8px;
`;

const InfoSection = styled.div`
  margin-bottom: 20px;
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #aaa;
`;

const InfoContent = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;

function MovieDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        // Try fetching as movie first
        const movieResponse = await fetchMovieDetails(id);
        setDetails(movieResponse.data);
      } catch (movieError) {
        try {
          // If movie fetch fails, try as TV show
          const tvResponse = await fetchTvDetails(id);
          setDetails(tvResponse.data);
        } catch (tvError) {
          setError("Could not find details for this title");
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!details) return <div>No details found</div>;

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <DetailsContainer>
      <Navbar />
      <BackdropContainer backdrop={details.backdrop_path} />
      
      <ContentContainer>
        <PosterContainer>
          <Poster 
            src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} 
            alt={details.title || details.name} 
          />
        </PosterContainer>
        
        <DetailsContent>
          <Title>{details.title || details.name}</Title>
          
          <Metadata>
            <MetaItem>
              <Rating score={details.vote_average}>
                {Math.round(details.vote_average * 10)}% Match
              </Rating>
            </MetaItem>
            <MetaItem>
              {details.release_date?.substring(0, 4) || details.first_air_date?.substring(0, 4)}
            </MetaItem>
            {details.runtime && (
              <MetaItem>{formatRuntime(details.runtime)}</MetaItem>
            )}
            {details.number_of_seasons && (
              <MetaItem>{details.number_of_seasons} Season{details.number_of_seasons !== 1 ? 's' : ''}</MetaItem>
            )}
          </Metadata>
          
          <Overview>{details.overview}</Overview>
          
          <ButtonsContainer>
            <PlayButton as={Link} to={`/watch/${id}`}>
              <ButtonIcon><FaPlay /></ButtonIcon> Play
            </PlayButton>
            <SecondaryButton>
              <ButtonIcon><FaPlus /></ButtonIcon> My List
            </SecondaryButton>
            <SecondaryButton>
              <ButtonIcon><FaThumbsUp /></ButtonIcon> Rate
            </SecondaryButton>
          </ButtonsContainer>
          
          {details.genres && details.genres.length > 0 && (
            <InfoSection>
              <InfoTitle>Genres</InfoTitle>
              <InfoContent>
                {details.genres.map(genre => genre.name).join(', ')}
              </InfoContent>
            </InfoSection>
          )}
          
          {details.production_companies && details.production_companies.length > 0 && (
            <InfoSection>
              <InfoTitle>Production</InfoTitle>
              <InfoContent>
                {details.production_companies.map(company => company.name).join(', ')}
              </InfoContent>
            </InfoSection>
          )}
        </DetailsContent>
      </ContentContainer>
    </DetailsContainer>
  );
}

export default MovieDetails;