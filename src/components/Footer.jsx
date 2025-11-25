import { useState } from 'react'
import { useEffect } from 'react'
import './Footer.css'
import Home from '../assets/icons/home.png';
import Search from '../assets/icons/Search.png';
import mas from '../assets/icons/mas.png';
import User from '../assets/icons/User.png';
import Diario from '../assets/icons/Diario.png';

function Footer() {
  

  return (
    <footer className="footer-container">
      <a href="#" className="footer-btn"><img src={Home} alt="Home" className="footer-icon" /> </a>
      <a href="#" className="footer-btn"><img src={Search} alt="Search" className="footer-icon" /> </a>
      <a href="#" className="footer-btn"><img src={mas} alt="mas" className="footer-icon" /> </a>
      <a href="#" className="footer-btn"><img src={Diario} alt="Diario" className="footer-icon" /> </a>
      <a href="#" className="footer-btn"><img src={User} alt="User" className="footer-icon" /> </a>


    </footer>
  )
}

export default Footer
