// L'animació de gir del logo s'ha fet integrament amb IA

import React, { useState } from 'react';
import './Header.css'
import Tree from '../assets/icons/Tree.svg?react';

function Header() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [randomStyle, setRandomStyle] = useState({});

  const handleEasterEgg = () => {
    if (isAnimating) return;

    // 1. Calculem angle random
    const randomAngle = 2160 + Math.floor(Math.random() * 360);

    // 2. Passem l'angle al CSS
    setRandomStyle({ '--desti-final': `${randomAngle}deg` });
    setIsAnimating(true);

    // 3. Temporitzador
    setTimeout(() => {
      setIsAnimating(false);
    }, 3500);
  };

  return (
    <div className='header-container'>
      
      {/* --- MÀGIA: DEFINICIÓ DEL GRADIENT (Invisible) --- */}
      {/* Això crea un ID que podem cridar des del CSS */}
      <svg width="0" height="0" style={{ position: 'absolute', visibility: 'hidden' }}>
        <defs>
          <linearGradient id="gradient-bruixola" x1="0" y1="0" x2="0" y2="1">
            {/* Part de Dalt: VERMELL */}
            <stop offset="0%" stopColor="red" />
            <stop offset="65%" stopColor="red" /> {/* Tal com has demanat: pots ajustar el % segons on vulguis el tall */}
            
            {/* Part de Baix: NEGRE */}
            <stop offset="65%" stopColor="var(--blau)" />
            <stop offset="100%" stopColor="var(--blau)" />
          </linearGradient>
        </defs>
      </svg>
      {/* ----------------------------------------------- */}

      <div 
        onClick={handleEasterEgg} 
        style={{ cursor: 'pointer', display: 'flex' }}
      >
        <Tree 
            className={`tree-icon ${isAnimating ? 'activa' : ''}`}
            style={{ 
               width: '28px', 
               height: '28px', 
               color: 'var(--negre)', // Color per defecte
               ...randomStyle 
            }} 
        />
      </div>
      <p className='Titol'>MonumentApp</p>
    </div>
  )
}

export default Header