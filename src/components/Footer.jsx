import './Footer.css';
import Home from '../assets/icons/home.png';
import Search from '../assets/icons/Search.png';
import mas from '../assets/icons/mas.png';
import User from '../assets/icons/User.png';
import Diario from '../assets/icons/Diario.png';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer-container">
      <Link to="/" className="footer-btn">
        <img src={Home} alt="Home" className="footer-icon" />
      </Link>
      <Link to="/search" className="footer-btn">
        <img src={Search} alt="Search" className="footer-icon" />
      </Link>
      <Link to="#" className="footer-btn">
        <img src={mas} alt="mas" className="footer-icon" />
      </Link>
      <Link to="#" className="footer-btn">
        <img src={Diario} alt="Diario" className="footer-icon" />
      </Link>
      <Link to="#" className="footer-btn">
        <img src={User} alt="User" className="footer-icon" />
      </Link>
    </footer>
  );
}

export default Footer;
