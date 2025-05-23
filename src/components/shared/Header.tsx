import { NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';
import { usePostStore } from './../../store/postStore';
import styles from './../../styles/Header.module.css';

const Header = () => {
  const { searchText, setSearchText } = usePostStore();
  return (
    <nav className={styles.header}>
      <ul>
        <li>
          <NavLink
            to="/VW-project/"
            end
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/VW-project/favorites"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Favorites
          </NavLink>
        </li>
      </ul>
      <ul>
        <li>
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            label="Search Posts"
            name="search-nav"
            hideLabel
          />
        </li>
      </ul>
    </nav>
  );
};

export default Header;
