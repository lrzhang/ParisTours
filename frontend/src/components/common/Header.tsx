import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="nav">
        <Link to={ROUTES.HOME} className="nav__logo">
          <img src="/leaf-favicon.svg" alt="ParisTours" />
        </Link>
        
        <nav className="nav__menu">
          <Link 
            to={ROUTES.HOME} 
            className={`nav__link ${location.pathname === ROUTES.HOME ? 'nav__link--active' : ''}`}
          >
            Home
          </Link>
          {/* <Link 
            to={ROUTES.BOOK} 
            className={`nav__link ${location.pathname === ROUTES.BOOK ? 'nav__link--active' : ''}`}
          >
            Book Tour
          </Link> */}
        </nav>
      </div>
    </header>
  );
};

export default Header; 