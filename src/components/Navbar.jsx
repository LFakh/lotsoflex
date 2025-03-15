import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaBell, FaUser } from 'react-icons/fa';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  padding: 0 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  transition: all 0.5s ease;
  background-color: ${props => props.show ? '#111' : 'transparent'};

  @media (max-width: 768px) {
    padding: 0 30px;
  }
`;

const Logo = styled.img`
  height: 30px;
  cursor: pointer;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  margin-right: 20px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #e5e5e5;
  text-decoration: none;
  margin-right: 20px;
  font-size: 14px;
  transition: color 0.3s;
  
  &:hover {
    color: #b3b3b3;
  }
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  margin-left: 20px;
  cursor: pointer;
  font-size: 18px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const SearchInput = styled.input`
  background-color: #111;
  border: 1px solid #333;
  color: white;
  padding: 8px 12px;
  padding-left: 40px;
  border-radius: 4px;
  outline: none;
  width: ${props => props.active ? '240px' : '0px'};
  opacity: ${props => props.active ? '1' : '0'};
  transition: all 0.5s;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  color: white;
  cursor: pointer;
`;

function Navbar() {
  const [show, setShow] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
      setSearchActive(false);
    }
  };

  return (
    <Nav show={show}>
      <Link to="/">
        <Logo src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" />
      </Link>

      <NavItems>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/tv-shows">TV Shows</NavLink>
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/my-list">My List</NavLink>
        </NavLinks>

        <NavIcons>
          <SearchContainer>
            <SearchIcon onClick={() => setSearchActive(!searchActive)}>
              <FaSearch />
            </SearchIcon>
            <form onSubmit={handleSearch}>
              <SearchInput 
                active={searchActive}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Titles, people, genres"
              />
            </form>
          </SearchContainer>
          <IconButton>
            <FaBell />
          </IconButton>
          <IconButton>
            <FaUser />
          </IconButton>
        </NavIcons>
      </NavItems>
    </Nav>
  );
}

export default Navbar;