import React from 'react';
import './TreeCard.css';

// Importem la imatge de seguretat (Fallback)
// Assegura't que la ruta sigui correcta des d'on està aquest fitxer
import DefaultImage from '../assets/icons/Imatge.svg'; 

import iconLocation from '../assets/icons/Home.svg';
import iconHeight from '../assets/icons/Alcada.svg';
import iconTrunk from '../assets/icons/Amplada.svg';
import iconCrown from '../assets/icons/Capcal.svg';

const TreeCard = ({ 
  imageSrc,      // La foto de l'arbre (pot venir buida)
  location,      // Text: Ubicació
  height,        // Text: Alçada
  trunkWidth,    // Text: Amplada tronc
  crownWidth,    // Text: Amplada capçal
  
}) => {

  // Lògica de la imatge: Si 'imageSrc' existeix, la posem. Si no, posem 'DefaultImage'.
  const displayImage = imageSrc ? imageSrc : DefaultImage;

  // Helper per no repetir codi 4 vegades (Component intern petit)
  const InfoRow = ({ icon, text }) => (
    <div className="data-row">
      {/* Si no passem icona, posem un quadrat buit per no trencar l'alineació */}
      {icon ? <img src={icon} alt="" className="data-icon" /> : <div className="data-icon" />}
      <span className="data-text">{text || "-"}</span>
    </div>
  );

  return (
    <article className="tree-card">
      
      {/* 1. Imatge (Esquerra) */}
      <div className="card-image-container">
        <img 
          src={displayImage} 
          alt="Arbre" 
          className="card-image" 
          // Afegeix això per si la URL existeix però dona error 404
          onError={(e) => { e.target.src = DefaultImage; }} 
        />
      </div>

      {/* 2. Dades (Dreta) */}
      <div className="card-data-container">
        
        {/* Fila 1: Ubicació */}
        <InfoRow icon={iconLocation} text={location} />
        
        {/* Fila 2: Alçada Arbre */}
        <InfoRow icon={iconHeight} text={height} />
        
        {/* Fila 3: Amplada Tronc */}
        <InfoRow icon={iconTrunk} text={trunkWidth} />
        
        {/* Fila 4: Amplada Capçal */}
        <InfoRow icon={iconCrown} text={crownWidth} />

      </div>

    </article>
  );
};

export default TreeCard;