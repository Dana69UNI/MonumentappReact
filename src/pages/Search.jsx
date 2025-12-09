import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TreeCard from '../components/TreeCard.jsx';
import Divider from '../components/Divider.jsx';
import Space from '../components/Space.jsx';
import imatge_mostra from '../assets/FotosArbres/Avet de Canejan_2.png';

const API_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres?select=id%2Cnom%2Cmunicipi%2Calcada%2Cgruix%2Ccapcal%2Ccomarques%28comarca%29&order=id.asc';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // <-- estado para la búsqueda

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
          throw new Error('Error connectant amb Supabase');
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

  if (loading) {
    return <div>Carregant Arbres...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filtrar posts según searchTerm
  const filteredPosts = posts.filter(arbre =>
    arbre.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Cercar</h1>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Busca un arbre per nom..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '8px', margin: '10px 0', width: '100%', boxSizing: 'border-box' }} //Por lo que veo el chat me hace unos css en el codigo, pero bueno eso se puede cambiar
      />

      <p>Resultats de la base de dades:</p>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((arbre) => (
          <React.Fragment key={arbre.id}>
            <Link
              to={`/arbre/${arbre.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <TreeCard 
                name={arbre.nom}
                titleColor="blau"
                municipality={arbre.municipi}
                comarca={arbre.comarques?.comarca}
                height={arbre.alcada}
                trunkWidth={arbre.gruix}
                crownWidth={arbre.capcal}
                imageSrc={imatge_mostra} 
              />
            </Link>
            <Divider />
          </React.Fragment>
        ))
      ) : (
        <p>No s'ha trobat cap arbre amb aquest nom.</p>
      )}

      <Space />
    </div>
  );
}

export default Search;
