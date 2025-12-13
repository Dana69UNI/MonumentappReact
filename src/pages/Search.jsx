import React, { useState, useEffect } from 'react';
import './Search.css';
import TreeCard from '../components/TreeCard.jsx';
import Divider from '../components/Divider.jsx';
import Space from '../components/Space.jsx';

import IconSearch from '../assets/icons/Search.svg?react';
import IconFilter from '../assets/icons/Filtre.svg?react';
import IconOrder from '../assets/icons/Ordenar.svg?react';


// URL i KEY correctes
const API_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres?select=id%2Cnom%2Cmunicipi%2Calcada%2Cgruix%2Ccapcal%2Ccomarques%28comarca%29&order=id.asc';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';

const Search = () => {
  const [posts, setPosts] = useState([]); // Inicialitzem com array buit []
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "apikey": API_KEY,
            "Authorization": `Bearer ${API_KEY}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Error connectant amb la Base de Dades');
        }

        const data = await response.json();
        setPosts(data); 

      } catch (err) {
        console.error(err);
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchPosts(); 
  }, []); 

  //FILTRATGE
  //variable que només tindrà els arbres que coincideixin amb la cerca.
  //es recalcula cada cop que cliquem una lletra (canvi de searchTerm) o quan es carreguen els posts
  const filteredPosts = posts.filter((arbre) => {
    // Si no hi ha text, ho retornem tot
    if (searchTerm === '') return true;

    // Convertim a minúscules per ignorar majúscules/minúscules
    const term = searchTerm.toLowerCase();
    
    // Comprovem si coincideix amb NOM, MUNICIPI o COMARCA
    // Fem servir ?. per si algun camp és null
    const matchNom = arbre.nom?.toLowerCase().includes(term);
    const matchMunicipi = arbre.municipi?.toLowerCase().includes(term);
    const matchComarca = arbre.comarques?.comarca?.toLowerCase().includes(term);

    return matchNom || matchMunicipi || matchComarca;
  });

  // A PARTIR D'AQUÍ JA ES MOSTREN DAAAADEEEEES!!! ole oleee. Visca els arbres monumentals!!! Visca Catalunyaaaa!!!

  if (loading) {
    return <div>Carregant Arbres...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    // CONTENIDOR PRINCIPAL
    <div className="search-page-container"> 
          
      {/* BARRA DE CERCA */}
      <div className="search-bar">
        {/* Icona de color negre fluix */}
        <IconSearch style={{ width: '50px', color: 'var(--negre-fluix)' }} />
        
        <input type="text" className="search-input" placeholder="Cercar arbre, comarca o municipi" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Actualitzem estat al escriure
        />
      </div>

      {/* FILTRAR I ORDENAR */}
      <div className="actions-container">
        
        {/* Botó Filtrar */}
        <div className="action-item">
            <IconFilter style={{ width: '30px', color: 'var(--negre)' }} />
            <span className="action-text">Filtrar</span>
        </div>

        {/* Separador Vertical */}
        <div className="vertical-sep"></div>

        {/* Botó Ordenar */}
        <div className="action-item">
            <IconOrder style={{ width: '30px', color: 'var(--negre)' }} />
            <span className="action-text">Ordenar</span>
        </div>

      </div>

      <Divider />

      {/* RESULTATS */}
      {/* Fem servir filteredPosts en lloc de posts */}
      {filteredPosts.length > 0 ? (
          filteredPosts.map((arbre) => (
            <React.Fragment key={arbre.id}>
              <TreeCard 
                id={arbre.id}
                name={arbre.nom}
                titleColor="blau"
                municipality={arbre.municipi}
                comarca={arbre.comarques?.comarca} 
                height={arbre.alcada}
                trunkWidth={arbre.gruix}
                crownWidth={arbre.capcal}
              />
              <Divider />
            </React.Fragment>
          ))
      ) : (
          /* Missatge si no trobem res */
          <div className="no-results">
              <p>No s'ha trobat resultats</p>
          </div>
      )}
      
      <Space />
    </div>

  );
  
}

export default Search;