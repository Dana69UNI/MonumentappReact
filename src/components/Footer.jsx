// import { useState } from 'react'
// import { useEffect } from 'react'
// import './Footer.css'
// import Home from '../assets/icons/Home.svg';
// import Search from '../assets/icons/Search.png';
// import mas from '../assets/icons/mas.png';
// import User from '../assets/icons/User.png';
// import Diario from '../assets/icons/Diario.png';

// function Footer() {
  

//   return (
//     // UTILITZAR RUTES
//     <footer className="footer-container">
//       <a href="../pages/HomePage.jsx" className="footer-btn"><img src={Home} alt="Home" className="footer-icon" /> </a>
//       {/* <Link to="/" style={styles.link}>
//           <img src={Home} alt="Logo Inici" />
//       </Link>       */}
//       <a href="../pages/Search.jsx" className="footer-btn"><img src={Search} alt="Search" className="footer-icon" /> </a>
//       <a href="#" className="footer-btn"><img src={mas} alt="mas" className="footer-icon" /> </a>
//       <a href="#" className="footer-btn"><img src={Diario} alt="Diario" className="footer-icon" /> </a>
//       <a href="#" className="footer-btn"><img src={User} alt="User" className="footer-icon" /> </a>

    

//     </footer>
//   )
// }

// export default Footer


import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
            // 1. CAS HOME: Ha de ser idèntic, si no s'activaria amb tot
            isActive = location.pathname === '/';
          } 
          
          else {
            // 2. RESTA DE CASOS: Si estem a /biblioteca/roure, volem que /biblioteca s'activi
            isActive = location.pathname.startsWith(item.path);
          }

          return (
            <li key={item.name} className={`footer-item ${isActive ? 'active' : ''}`}>
              <Link to={item.path} className="footer-link">
                
                {/*Imatges footer en format <img>*/}
                <div className="icon-container">
                    <img 
                        src={item.icon} 
                        alt={item.name} 
                        className="footer-icon-img" 
                    />
                </div>

                {/*Això serveix per text*/}
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