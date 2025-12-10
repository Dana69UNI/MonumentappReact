import React from 'react';
import { useNavigate } from 'react-router-dom'; //Per navegar
import './TreeCard.css';

// Imatge de seguretat
import DefaultImage from '../assets/icons/Imatge.svg'; 

import IconLocation from '../assets/icons/Ubication.svg?react';
import IconHeight from '../assets/icons/Alcada.svg?react';
import IconTrunk from '../assets/icons/Amplada.svg?react';
import IconCrown from '../assets/icons/Capcal.svg?react';

const TreeCard = ({ 
    id,
    name,
    titleColor,
    imageSrc,
    municipality,
    comarca,
    height,
    trunkWidth,
    crownWidth,
  }) => {

  const navigate = useNavigate(); // Hook per moure'ns de pàgina

  const displayImage = imageSrc ? imageSrc : DefaultImage;// Lògica de la imatge: Si 'imageSrc' existeix, la posem. Si no, posem 'DefaultImage'.

  const locationText = `${municipality || "?"}, ${comarca || "?"}`;// Resultat: "Girona, Gironès"

  // Funció que s'executa quan cliquem la targeta
  const handleCardClick = () => {
    // Això ens portarà a: /biblioteca/15 (per exemple)
    navigate(`/cercar/${id}`);
  };

  //Helper per no repetir codi 4 vegades (Component intern petit)
  //Accepta 'Icon' (component) i 'color' (opcional)
  const InfoRow = ({ Icon, text, color }) => (
    <div className="data-row" style={{ color: color || 'var(--negre)' }}>
      {Icon ? <Icon className="data-icon" /> : <div className="data-icon" />}
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
        <InfoRow Icon={IconLocation} text={locationText} color="var(--negre)" /> 
        {/* Fila 2: Alçada */}
        <InfoRow Icon={IconHeight} text={height ? `${height}m` : "-"} color="var(--negre)" />
        {/* Fila 3: Amplada tronc */}
        <InfoRow Icon={IconTrunk} text={trunkWidth ? `${trunkWidth}m` : "-"} color="var(--negre)" />
        {/* Fila 4: Amplada capçalera */}
        <InfoRow Icon={IconCrown} text={crownWidth ? `${crownWidth}m` : "-"} color="var(--negre)" />

      </div>

    </article>
  );
};

export default TreeCard;