import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Biblioteca.css';
import Divider from '../components/Divider';
import Space from '../components/Space';
import TreeCard from '../components/TreeCard';

//ICONES
import CorBuit from '../assets/icons/Like.svg?react';
import CorPle from '../assets/icons/Like_filled.svg?react';
import PendentBuit from '../assets/icons/Guardar.svg?react';
import PendentPle from '../assets/icons/Guardar_filled.svg?react';
import UllBuit from '../assets/icons/Ull.svg?react';
import UllPle from '../assets/icons/Ull_filled.svg?react';

//IMATGES
import DefaultImage from '../assets/icons/Imatge.svg';

const API_KEY = import.meta.env.VITE_API_KEY;

const Biblioteca = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  //ESTAT PESTANYES: 'preferits' | 'visitats' | 'pendents'
const activeTab = searchParams.get('tab') || 'preferits';  
  //ESTAT DADES
  const [arbres, setArbres] = useState([]);
  const [loading, setLoading] = useState(true);

  //CÀRREGA DE DADES
  useEffect(() => {
    
    //Determinem la crida a l'API segons la pestanya activa
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
      setSearchParams({ tab: tab });    
    }
  };

  return (
    <div className="biblioteca-container">
      
      {/* BARRA DE NAVEGACIÓ SUPERIOR */}
      <div className="tabs-container">
        
        {/* PREFERITS */}
        <button 
          className={`tab-item ${activeTab === 'preferits' ? 'actiu' : ''}`}
          onClick={() => handleTabChange('preferits')}
        >
          {activeTab === 'preferits' ? (
             <CorPle style={{ width:'24px', color: 'var(--blau)' }} />
          ) : (
             <CorBuit style={{ width:'24px', color: 'var(--negre)' }} />
          )}
          <span className="tab-text">Preferits</span>
        </button>

        {/* Separador Vertical */}
        <div className="vertical-divider"></div>

        {/* VISITATS */}
        <button 
          className={`tab-item ${activeTab === 'visitats' ? 'actiu' : ''}`}
          onClick={() => handleTabChange('visitats')}
        >
          {activeTab === 'visitats' ? (
             <UllPle style={{ width:'24px', color: 'var(--blau)' }} />
          ) : (
             <UllBuit style={{ width:'24px', color: 'var(--negre)' }} />
          )}
          <span className="tab-text">Visitats</span>
        </button>

        {/* Separador Vertical */}
        <div className="vertical-divider"></div>

        {/* PENDENTS */}
        <button 
          className={`tab-item ${activeTab === 'pendents' ? 'actiu' : ''}`}
          onClick={() => handleTabChange('pendents')}
        >
          {activeTab === 'pendents' ? (
             <PendentPle style={{ width:'24px', color: 'var(--blau)' }} />
          ) : (
             <PendentBuit style={{ width:'24px', color: 'var(--negre)' }} />
          )}
          <span className="tab-text">Pendents</span>
        </button>

      </div>

      <Divider />


      {/* LLISTA D'ARBRES */}
      <div className="llista-arbres">
        
        {loading ? (
          <div>Carregant...</div>
        ) : arbres.length > 0 ? (
          arbres.map((item) => (
            //IMPORTAAAANT!!! item.arbres conté tota la info de l'arbre gràcies al JOIN (*).
            //Ojuuu amb com arriben les dades.
            <React.Fragment key={item.arbre_id}>
              <TreeCard     
                id={item.arbre_id}  // Per navegar al detall
                basePath="/biblioteca"
                name={item.arbres?.nom}
                titleColor="blau"
                municipality={item.arbres?.municipi}
                comarca={item.arbres?.comarques?.comarca}            
                height={item.arbres?.alcada}
                trunkWidth={item.arbres?.gruix}
                crownWidth={item.arbres?.capcal}              
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