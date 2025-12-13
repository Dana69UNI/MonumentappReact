import React from 'react';
import { useNavigate } from 'react-router-dom'; //Per navegar
import './TreeCard.css';

// Imatge de seguretat
import DefaultImage from '../assets/icons/Imatge.svg'; 

import IconLocation from '../assets/icons/Ubication.svg?react';
import IconHeight from '../assets/icons/Alcada.svg?react';
import IconTrunk from '../assets/icons/Amplada.svg?react';
import IconCrown from '../assets/icons/Capcal.svg?react';

//URL Supabase imatges
const STORAGE_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/storage/v1/object/public/fotos-arbres';

const TreeCard = ({ 
    id,
    name,
    titleColor,
    municipality,
    comarca,
    height,
    trunkWidth,
    crownWidth,
  }) => {

  const navigate = useNavigate(); // Hook per moure'ns de pàgina
  
  // Construïm la URL de la imatge - "id_Sketch.png"
  const supabaseImage = `${STORAGE_URL}/${id}_Sketch.png`;

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
      
      {/* Imatge (Esquerra) */}
      <div className="card-image-container">
        <img 
          //URL de la imatge
          src={supabaseImage} 
          alt={name} 
          className="card-image" 
          //GESTIÓ D'ERRORS: Si la imatge no existeix a Supabase, posem la Default
          onError={(e) => { 
            e.target.onerror = null; // Evita bucle infinit
            e.target.src = DefaultImage; 
          }} 
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