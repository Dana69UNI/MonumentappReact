import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

//svg amb ?react i biblioteca a vite.config.js
import IconHome from '../assets/icons/Home.svg?react';
import IconSearch from '../assets/icons/Search.svg?react';
import IconNew from '../assets/icons/New.svg?react';
import IconBiblioteca from '../assets/icons/Tree.svg?react';
import IconProfile from '../assets/icons/User.svg?react';

const Footer = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Inici',
      path: '/',
      icon: IconHome // Ara això és un Component, no un string
    },
    {
      name: 'Cercar',
      path: '/cercar',
      icon: IconSearch
    },
    { 
      name: 'Nou',
      path: '/nou',
      icon: IconNew
    },
    {
      name: 'Biblioteca',
      path: '/biblioteca', 
      icon: IconBiblioteca
    },
    {
      name: 'Perfil',
      path: '/perfil',
      icon: IconProfile
    }
  ];

  return (
    <nav className="footer-nav">
      <ul className="footer-list">
        {menuItems.map((item) => {
          
          let isActive = false;

          if (item.path === '/') {
            isActive = location.pathname === '/';
          } else {
            // Això gestiona /biblioteca/detall, etc.
            isActive = location.pathname.startsWith(item.path);
          }

          const IconComponent = item.icon;

          return (
            <li key={item.name} className={`footer-item ${isActive ? 'active' : ''}`}>
              <Link to={item.path} className="footer-link">
                
                <IconComponent className="footer-icon" />

              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Footer;