import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h3 className="footer__heading">ParisTours</h3>
          <p className="footer__text">
            Discover the hidden gems of Paris with our expert-guided tours. 
            Experience the city like never before.
          </p>
        </div>
        
        <div className="footer__section">
          <h4 className="footer__heading">Contact Info</h4>
          <div className="footer__contact">
            <p className="footer__contact-item">
              <span className="footer__contact-label">Email:</span>
              <a href="mailto:parisTHCtours@gmail.com" className="footer__contact-link">
                parisTHCtours@gmail.com
              </a>
            </p>
            <p className="footer__contact-item">
              <span className="footer__contact-label">Phone:</span>
              <a href="tel:+33123456789" className="footer__contact-link">
                +33 1 23 45 67 89
              </a>
            </p>
          </div>
        </div>
        
        <div className="footer__section">
          <h4 className="footer__heading">Tour Information</h4>
          <ul className="footer__list">
            <li className="footer__list-item">Duration: 3-4 hours</li>
            <li className="footer__list-item">Group size: Up to 15 people</li>
            <li className="footer__list-item">Languages: English, French</li>
            <li className="footer__list-item">Difficulty: Easy</li>
          </ul>
        </div>
      </div>
      
      <div className="footer__bottom">
        <p className="footer__copyright">
          &copy; {new Date().getFullYear()} ParisTours. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 