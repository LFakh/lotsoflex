import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Row from '../components/Row';
import { 
  fetchNetflixOriginals, 
  fetchTrending, 
  fetchTopRated, 
  fetchActionMovies, 
  fetchComedyMovies, 
  fetchHorrorMovies, 
  fetchRomanceMovies, 
  fetchDocumentaries 
} from '../services/tmdbApi';

const HomeContainer = styled.div`
  background-color: #111;
  color: white;
  min-height: 100vh;
`;

function Home() {
  return (
    <HomeContainer>
      <Navbar />
      <Banner />
      <Row 
        title="NETFLIX ORIGINALS" 
        fetchUrl={fetchNetflixOriginals} 
        isLargeRow
      />
      <Row title="Trending Now" fetchUrl={fetchTrending} />
      <Row title="Top Rated" fetchUrl={fetchTopRated} />
      <Row title="Action Movies" fetchUrl={fetchActionMovies} />
      <Row title="Comedy Movies" fetchUrl={fetchComedyMovies} />
      <Row title="Horror Movies" fetchUrl={fetchHorrorMovies} />
      <Row title="Romance Movies" fetchUrl={fetchRomanceMovies} />
      <Row title="Documentaries" fetchUrl={fetchDocumentaries} />
    </HomeContainer>
  );
}

export default Home;