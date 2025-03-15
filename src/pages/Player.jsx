import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchMovieDetails, fetchTvDetails } from '../services/tmdbApi';
import { FaArrowLeft } from 'react-icons/fa';

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 1000;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100%; /* Adjust height to allow space for streaming providers */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background-image: ${props => props.backdrop ? `url("https://image.tmdb.org/t/p/original/${props.backdrop}")` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
  }
`;

const PlaceholderContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 20px;
`;

const PlaceholderTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PlaceholderText = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StreamingProviders = styled.div`
  margin-top: 20px;
  color: white;
  text-align: center;
  z-index: 1; /* Ensure it appears above the background */
  padding: 69px; /* Add padding for better spacing */
`;

const Provider = styled.div`
  display: inline-block;
  margin: 0 10px;
  text-align: center;
`;

const ProviderLogo = styled.img`
  width: 50px;
  height: 50px;
`;

function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [streamingProviders, setStreamingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        // Try fetching as movie first
        const movieResponse = await fetchMovieDetails(id);
        setContent(movieResponse.data);
        fetchVideo(movieResponse.data.id); // Fetch video for the movie
        fetchStreamingProviders(movieResponse.data.id); // Fetch streaming providers
      } catch (movieError) {
        console.error("Error fetching movie details:", movieError);
        try {
          // If movie fetch fails, try as TV show
          const tvResponse = await fetchTvDetails(id);
          setContent(tvResponse.data);
          fetchVideo(tvResponse.data.id); // Fetch video for the TV show
          fetchStreamingProviders(tvResponse.data.id); // Fetch streaming providers
        } catch (tvError) {
          console.error("Could not find content details:", tvError);
        }
      } finally {
        setLoading(false);
      }
    }

    const fetchVideo = async (contentId) => {
      try {
        const videoResponse = await fetch(`https://api.themoviedb.org/3/movie/${contentId}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`);
        const videos = await videoResponse.json();
        if (videos.results.length > 0) {
          setVideoKey(videos.results[0].key); // Get the first video key
        }
      } catch (error) {
        console.error("Could not fetch video details", error);
      }
    };

    const fetchStreamingProviders = async (contentId) => {
      try {
        const providerResponse = await fetch(`https://api.themoviedb.org/3/movie/${contentId}/watch/providers?api_key=${import.meta.env.VITE_TMDB_API_KEY}`);
        const providers = await providerResponse.json();
        console.log("Streaming Providers Response:", providers); // Debugging log
        const usProviders = providers.results.US; // Get US providers
        if (usProviders) {
          setStreamingProviders(usProviders.flatrate || []); // Set flatrate providers
        }
      } catch (error) {
        console.error("Could not fetch streaming providers", error);
      }
    };

    fetchContent();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <PlayerContainer>
        <BackButton onClick={handleBack}>
          <FaArrowLeft />
        </BackButton>
        <VideoContainer>
          <PlaceholderContent>Loading...</PlaceholderContent>
        </VideoContainer>
      </PlayerContainer>
    );
  }

  return (
    <PlayerContainer>
      <BackButton onClick={handleBack}>
        <FaArrowLeft />
      </BackButton>
      
      <VideoContainer backdrop={content?.backdrop_path}>
        <PlaceholderContent>
          <PlaceholderTitle>
            {content?.title || content?.name || "Video Player"}
          </PlaceholderTitle>
          {videoKey ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoKey}`}
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <PlaceholderText>
              No video available.
            </PlaceholderText>
          )}
        </PlaceholderContent>
        
        <StreamingProviders>
          <h3>Available on:</h3>
          {streamingProviders.length > 0 ? (
            streamingProviders.map(provider => (
              <Provider key={provider.provider_id}>
                <ProviderLogo src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`} alt={provider.provider_name} />
                <p>{provider.provider_name}</p>
              </Provider>
            ))
          ) : (
            <PlaceholderText>No streaming providers available.</PlaceholderText>
          )}
        </StreamingProviders>
      </VideoContainer>
    </PlayerContainer>
  );
}

export default Player;
