import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; 
import Divider from '../components/Divider';
import './Home.css';

// Importem la imatge per defecte (ja que l'API no ens en dona cap de moment)
import DefaultImage from '../assets/icons/Imatge.svg';

//Imatges que haurem de borrar quan tinguem les reals
import Aulina from '../assets/FotosArbres/Aulina Reclamadora de Puigsaguàrdia.png';
import Avet from '../assets/FotosArbres/Avet de Canejan_2.png';
import Castanyer from '../assets/FotosArbres/Castanyer_de_can_Cuc.png';
import Cedre from '../assets/FotosArbres/Cedre de Masjoan.png';
import Platan from '../assets/FotosArbres/Plàtan de la Plaça de Colera.png';
import Sequioia from '../assets/FotosArbres/Sequoia-de-Tortades.png';
//ARRAY ORDENAT (Arbres recomanats)
const IMATGES_LOCAL_PROVISIONALS = [
  Sequioia,
  Castanyer,
  Cedre,
  Aulina,
  Platan
];

//API
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';

const URL_RECOMANATS = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres_recomenats?recomenacio_estat=eq.true&select=id,arbre_id,arbres(nom, imatge)&order=id.asc';


const Home = () => {
  const navigate = useNavigate();
  
  // --- 2. ESTATS SEPARATS PER A CADA SECCIÓ ---
  const [recomanats, setRecomenats] = useState([]);
  // const [novetats, setNovetats] = useState([]); // <--- Preparat pel futur
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    // Funció específica per carregar recomanats
    const fetchRecomanats = async () => {
      try {
        const response = await fetch(URL_RECOMANATS, {
          method: "GET",
          headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` }
        });
        const data = await response.json();
        setRecomenats(data);
      } catch (error) {
        console.error("Error carregant recomanats:", error);
      }
    };

    // Funció específica per carregar novetats (Exemple futur)
    /*
    const fetchNovetats = async () => {
       ... fetch(URL_NOVETATS)...
       setNovetats(data);
    };
    */

    // --- 3. EXECUTEM TOTES LES CRIDES ---
    // Fem servir una funció async mestra per esperar que tot es carregui (opcional)
    const carregarTot = async () => {
      setLoading(true);
      
      // Aquí cridem a totes les funcions
      await fetchRecomanats();
      // await fetchNovetats(); 
      
      setLoading(false);
    };

    carregarTot();

  }, []); // S'executa només al principi


  if (loading) return <div style={{padding:'0px'}}>Carregant Home...</div>;

  return (
    <div className="home-container">
      <Header />
      <Divider />

      {/* --- SECCIÓ 1: RECOMANATS --- */}
      <section className="home-section">
        <h2 className="section-title">ARBRES RECOMANATS</h2>
        
        <div className="horizontal-scroll-container">
          {/* Afegim 'index' al map per saber si és el 0, el 1, el 2... */}
          {recomanats.map((item, index) => {
            
            // TRUC PROVISIONAL:
            // Si tenim una foto a l'array local per a aquesta posició (index), la fem servir.
            // Si no, mirem si l'API en porta (item.arbres.imatge).
            // Si tampoc, posem la DefaultImage.
            const imatgeFinal = IMATGES_LOCAL_PROVISIONALS[index] || item.arbres?.imatge || DefaultImage;

            return (
              <div 
                key={item.id} 
                className="recommended-item"
                onClick={() => navigate(`/biblioteca/${item.arbre_id}`)} 
              >
                <img 
                  src={imatgeFinal} 
                  //per després src={item.arbres?.imatge || DefaultImage}
                  alt={item.arbres?.nom} 
                  className="rec-image" 
                />
                <span className="rec-name">{item.arbres?.nom}</span>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Home;