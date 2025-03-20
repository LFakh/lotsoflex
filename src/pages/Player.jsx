import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchMovieDetails, fetchTvDetails } from '../services/tmdbApi';
import { IoArrowBack } from 'react-icons/io5';

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #141414;
  color: white;
  overflow-y: auto;
`;

const BackButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }
`;

const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 80px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const VideoSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
`;

const VideoTitle = styled.h2`
  font-size: 1.2rem;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  margin: 0;
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
`;

const StyledIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

const ProvidersSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

const ProvidersTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const ProvidersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  justify-items: center;
`;

const Provider = styled.div`
  text-align: center;
`;

const ProviderLink = styled.a`
  display: block;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ProviderLogo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const ProviderName = styled.p`
  font-size: 0.9rem;
  color: #ccc;
`;

function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [streamingProviders, setStreamingProviders] = useState([]);
  const [streamingUrl, setStreamingUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        // Try fetching as movie first
        const movieResponse = await fetchMovieDetails(id);
        setContent(movieResponse.data);
        fetchVideo(movieResponse.data.id);
        fetchStreamingProviders(movieResponse.data.id);
        setStreamingUrl(`https://vidsrc.dev/embed/movie/${movieResponse.data.id}`);
      } catch (movieError) {
        try {
          // If movie fetch fails, try as TV show
          const tvResponse = await fetchTvDetails(id);
          setContent(tvResponse.data);
          fetchVideo(tvResponse.data.id);
          fetchStreamingProviders(tvResponse.data.id);
          setStreamingUrl(`https://vidsrc.dev/embed/tv/${tvResponse.data.id}`);
        } catch (tvError) {
          console.error("Could not find content details:", tvError);
        }
      } finally {
        setLoading(false);
      }
    }

    async function fetchVideo(contentId) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${contentId}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );
        const data = await response.json();
        if (data.results?.length > 0) {
          setVideoKey(data.results[0].key);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    }

    async function fetchStreamingProviders(contentId) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${contentId}/watch/providers?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );
        const data = await response.json();
        if (data.results?.US?.flatrate) {
          setStreamingProviders(data.results.US.flatrate);
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    }

    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <PlayerContainer>
        <BackButton onClick={() => navigate(-1)}>
          <IoArrowBack size={24} />
        </BackButton>
        <ContentWrapper>
          <Title>Loading...</Title>
        </ContentWrapper>
      </PlayerContainer>
    );
  }

  return (
    <PlayerContainer>
      <BackButton onClick={() => navigate(-1)}>
        <IoArrowBack size={24} />
      </BackButton>
      
      <ContentWrapper>
        <Title>{content?.title || content?.name}</Title>
        
        <VideoGrid>
          {streamingUrl && (
            <VideoSection>
              <VideoTitle>Full Movie</VideoTitle>
              <VideoWrapper>
                <StyledIframe
                  src={streamingUrl}
                  title="Movie Player"
                  allow="fullscreen"
                  allowFullScreen
                />
              </VideoWrapper>
            </VideoSection>
          )}
          
          {videoKey && (
            <VideoSection>
              <VideoTitle>Trailer</VideoTitle>
              <VideoWrapper>
                <StyledIframe
                  src={`https://www.youtube.com/embed/${videoKey}`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </VideoWrapper>
            </VideoSection>
          )}
        </VideoGrid>

        {streamingProviders.length > 0 && (
          <ProvidersSection>
            <ProvidersTitle>Available on Streaming</ProvidersTitle>
            <ProvidersGrid>
              {streamingProviders.map(provider => (
                <Provider key={provider.provider_id}>
                  <ProviderLink 
                    href={provider.provider_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ProviderLogo
                      src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
                      alt={provider.provider_name}
                    />
                    <ProviderName>{provider.provider_name}</ProviderName>
                  </ProviderLink>
                </Provider>
              ))}
            </ProvidersGrid>
          </ProvidersSection>
        )}
      </ContentWrapper>
    </PlayerContainer>
  );
}

export default Player;