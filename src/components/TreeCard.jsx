import React from 'react';
import { useNavigate } from 'react-router-dom'; //Per navegar
import './TreeCard.css';

// Importem la imatge de seguretat (Fallback)
import DefaultImage from '../assets/icons/Imatge.svg'; 
import iconLocation from '../assets/icons/Ubication.svg';
import iconHeight from '../assets/icons/Alcada.svg';
import iconTrunk from '../assets/icons/Amplada.svg';
import iconCrown from '../assets/icons/Capcal.svg';

const TreeCard = ({ 
  id,
  name,          // Nom de l'arbre
  titleColor,   // Color del títol ('blau' o 'negre')
  imageSrc,      // La foto de l'arbre (pot venir buida)
  municipality,      // Text: Ubicació
  comarca,         // Text: Comarca
  height,        // Text: Alçada
  trunkWidth,    // Text: Amplada tronc
  crownWidth,    // Text: Amplada capçal

  
  
}) => {

  const navigate = useNavigate(); // Hook per moure'ns de pàgina

  const displayImage = imageSrc ? imageSrc : DefaultImage;// Lògica de la imatge: Si 'imageSrc' existeix, la posem. Si no, posem 'DefaultImage'.

  const locationText = `${municipality || "?"}, ${comarca || "?"}`;// Resultat: "Girona, Gironès"

  // Funció que s'executa quan cliquem la targeta
  const handleCardClick = () => {
    // Això ens portarà a: /biblioteca/15 (per exemple)
    navigate(`/biblioteca/${id}`);
  };

  // Helper per no repetir codi 4 vegades (Component intern petit)
  const InfoRow = ({ icon, text }) => (
    <div className="data-row">
      {/* Si no passem icona, posem un quadrat buit per no trencar l'alineació */}
      {icon ? <img src={icon} alt="" className="data-icon" /> : <div className="data-icon" />}
      <span className="data-text">{text || "-"}</span>
    </div>
  );

  return (
    <article className="tree-card" onClick={handleCardClick}>
      
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
        
        {/* Triem la classe segons el que rebem a 'titleColor' */}
        <h3 className={`card-title ${titleColor === 'blau' ? 'title-style-blau' : 'title-style-negre'}`}>
          {name}
        </h3>
        
        
        {/* Fila 1: Ubicació */}
        <InfoRow icon={iconLocation} text={locationText}/>
        
        {/* Fila 2: Alçada Arbre */}
        <InfoRow icon={iconHeight} text={height ? `${height}m` : "-"} />
        
        {/* Fila 3: Amplada Tronc */}
        <InfoRow icon={iconTrunk} text={trunkWidth ? `${trunkWidth}m` : "-"} />
        
        {/* Fila 4: Amplada Capçal */}
        <InfoRow icon={iconCrown} text={crownWidth ? `${crownWidth}m` : "-"} />

      </div>

    </article>
  );
};

export default TreeCard;