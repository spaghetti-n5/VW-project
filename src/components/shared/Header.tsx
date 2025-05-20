import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
      <nav className="header">
        <ul>
          <li>
            <NavLink to="/VW-project/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/VW-project/favorites"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Favorites
            </NavLink>
          </li>
        </ul>
      </nav>
  );
};

export default Header;

