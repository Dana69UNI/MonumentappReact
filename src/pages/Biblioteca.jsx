import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Biblioteca.css';
import Divider from '../components/Divider';
import Space from '../components/Space';
import TreeCard from '../components/TreeCard';

//ICONES (pendent de modificar estètica)
import CorBuit from '../assets/icons/Like.svg';
import CorPle from '../assets/icons/Like_filled.svg';
import PendentBuit from '../assets/icons/Guardar.svg';
import PendentPle from '../assets/icons/Guardar_filled.svg';
import UllBuit from '../assets/icons/Ull.svg';
import UllPle from '../assets/icons/Ull_filled.svg';

//IMATGES
import DefaultImage from '../assets/icons/Imatge.svg';
import ImatgeProvisional from '../assets/FotosArbres/Avet de Canejan_2.png';


const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';

const Biblioteca = () => {
  // const navigate = useNavigate();

  //ESTAT PESTANYES: 'preferits' | 'visitats' | 'pendents'
  const [activeTab, setActiveTab] = useState('preferits');
  
  //ESTAT DADES
  const [arbres, setArbres] = useState([]);
  const [loading, setLoading] = useState(true);

  //CÀRREGA DE DADES
  useEffect(() => {
    
    //Determinem la crida a l'APIsegons la pestanya activa
    let filtreInteraccio = '';
    if (activeTab === 'preferits') filtreInteraccio = 'es_preferit=eq.true';
    else if (activeTab === 'visitats') filtreInteraccio = 'es_visitat=eq.true';
    else if (activeTab === 'pendents') filtreInteraccio = 'es_pendent=eq.true';

    //Construïm la URL (Join amb taula arbres)
    const URL = `https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/interaccions?${filtreInteraccio}&select=arbre_id,arbres(*,comarques(comarca))`;

    const fetchLlista = async () => {
      setLoading(true);
      try {
        const response = await fetch(URL, {
          method: "GET",
          headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` }
        });
        const data = await response.json();

        setArbres(data);

      } catch (error) {
        console.error("Error carregant biblioteca:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLlista();

  }, [activeTab]); // S'executa cada cop que canviem de pestanya


  //FUNCIÓ PER CANVIAR PESTANYA
  const handleTabChange = (tab) => {
    if (activeTab !== tab) {
      setArbres([]); // Netejem llista visualment abans de carregar la nova
      setActiveTab(tab);
    }
  };

  return (
    <div className="biblioteca-container">
      
      {/* --- BARRA DE NAVEGACIÓ SUPERIOR --- */}
      <div className="tabs-container">
        
        {/* PREFERITS */}
        <button 
          className={`tab-item ${activeTab === 'preferits' ? 'actiu' : ''}`}
          onClick={() => handleTabChange('preferits')}
        >
          <img 
            src={activeTab === 'preferits' ? CorPle : CorBuit} 
            alt="Preferits" 
            style={{width:'24px'}} 
          />
          <span className="tab-text">Preferits</span>
        </button>

        {/* Separador Vertical */}
        <div className="vertical-divider"></div>

        {/* VISITATS */}
        <button 
          className={`tab-item ${activeTab === 'visitats' ? 'actiu' : ''}`}
          onClick={() => handleTabChange('visitats')}
        >
          <img 
            src={activeTab === 'visitats' ? UllPle : UllBuit} 
            alt="Visitats" 
            style={{width:'24px'}} 
          />
          <span className="tab-text">Visitats</span>
        </button>

        {/* Separador Vertical */}
        <div className="vertical-divider"></div>

        {/* PENDENTS */}
        <button 
          className={`tab-item ${activeTab === 'pendents' ? 'actiu' : ''}`}
          onClick={() => handleTabChange('pendents')}
        >
          <img 
            src={activeTab === 'pendents' ? PendentPle : PendentBuit} 
            alt="Pendents" 
            style={{width:'24px'}} 
          />
          <span className="tab-text">Pendents</span>
        </button>

      </div>

      <Divider />


      {/* --- LLISTA D'ARBRES --- */}
      <div className="llista-arbres">
        
        {loading ? (
          <div>Carregant...</div>
        ) : arbres.length > 0 ? (
          arbres.map((item) => (
            //IMPORTAAAANT!!! item.arbres conté tota la info de l'arbre gràcies al JOIN (*).
            //Ojuuu amb com arriben les dades.
            <React.Fragment key={item.arbre_id}>
              <TreeCard 
                //key={item.arbre_id} // Clau única
    
                id={item.arbre_id}  // Per navegar al detall
                basePath="/biblioteca"

                name={item.arbres?.nom}
                titleColor="blau"
                
                municipality={item.arbres?.municipi}
                comarca={item.arbres?.comarques?.comarca}            
                height={item.arbres?.alcada}
                trunkWidth={item.arbres?.gruix}
                crownWidth={item.arbres?.capcal}
                
                // Imatge provisional
                imageSrc={ImatgeProvisional} 
              />

              <Divider />
            </React.Fragment>
          ))
        ) : (
          <div className="empty-state">
            <p>No tens cap arbre en aquesta llista.</p>
          </div>
        )}

      </div>

      <Space />
    </div>
  );
};

export default Biblioteca;