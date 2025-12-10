import React, { useState, useEffect } from 'react';
import TreeCard from '../components/TreeCard.jsx';
import Divider from '../components/Divider.jsx';
import Space from '../components/Space.jsx';

// BORRAR quan tinguem fotos a la BdD
import imatge_mostra from '../assets/FotosArbres/Avet de Canejan_2.png';

// URL i KEY correctes
const API_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres?select=id%2Cnom%2Cmunicipi%2Calcada%2Cgruix%2Ccapcal%2Ccomarques%28comarca%29&order=id.asc';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';

const Search = () => {
  const [posts, setPosts] = useState([]); // Inicialitzem com array buit []
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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


  // A PARTIR D'AQUÍ JA ES MOSTREN DAAAADEEEEES!!! ole oleee. Visca els arbres monumentals!!! Visca Catalunyaaaa!!!

  if (loading) {
    return <div>Carregant Arbres...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    // CONTENIDOR PRINCIPAL (Amb padding per separar de les vores)
    <div> 
      
      <h1>Cercar</h1>
      <p>Resultats de la base de dades:</p>
      

      {/* LLISTA D'ARBRES */}     
        {posts.map((arbre) => (
          <React.Fragment key={arbre.id}> {/* El .Fragment ens permet posar el divider */}
    
            <TreeCard 
              id={arbre.id} //No cal ja aquí pq la te React.Fragment (ho deixo per sidecas)
              name={arbre.nom}
              titleColor="blau"
              municipality={arbre.municipi}
              comarca={arbre.comarques?.comarca} 
              height={arbre.alcada}
              trunkWidth={arbre.gruix}
              crownWidth={arbre.capcal}
              
              imageSrc={imatge_mostra} // BORRAR: treure imatge_mostra i posar arbre.foto quan ho tinguem a la BdD
            />

            <Divider />
            
          </React.Fragment>
        ))}
      <Space />
    </div>

  );
  
}

export default Search;