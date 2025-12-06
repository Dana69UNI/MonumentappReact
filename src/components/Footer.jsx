import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './Footer.css'

//IMPORTAR IMATGES
import IconHome from '../assets/icons/Home.svg';
import IconSearch from '../assets/icons/Search.svg';
import IconNew from '../assets/icons/New.svg';
import IconBiblioteca from '../assets/icons/Tree.svg';
import IconProfile from '../assets/icons/User.svg';

const Footer = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Inici',
      path: '/',
      icon: IconHome //cada icona amb la variable
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
            //CAS HOME: Ha de ser idèntic (===), si no s'activaria amb tot
            isActive = location.pathname === '/';
          } 
          
          else {
            //RESTA DE CASOS: Si estem a /biblioteca/roure, volem que /biblioteca s'activi
            isActive = location.pathname.startsWith(item.path);
          }

          return (
            <li key={item.name} className={`footer-item ${isActive ? 'active' : ''}`}>
              <Link to={item.path} className="footer-link">
                
                {/*Imatges footer en format svg*/}
               <div 
                className="footer-icon-mask"
                style={{
                  // Passem la ruta de l'SVG a la propietat mask-image
                  WebkitMaskImage: `url(${item.icon})`,
                  maskImage: `url(${item.icon})`
                }}
              />

                {/*Això serveix per si hi volguessim textos*/}
                {/* <span className="label">{item.name}</span> */}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Footer;