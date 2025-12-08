import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; 
import Divider from '../components/Divider';
import TreeCard from '../components/TreeCard';
import Space from '../components/Space';

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
const URL_REPTE = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbre_repte_mensual?mes=eq.2025-12-01&select=id,descripcio,arbre_id,arbres(nom,municipi,alcada,gruix,capcal,comarques(comarca), imatge)';

const URL_ULTIM_VISITAT = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/interaccions?estat_llista=eq.visitat&select=arbre_id,visita_data,visita_text,arbres(id,nom,municipi,alcada,gruix,capcal,comarca_id,comarques(comarca))&order=visita_data.desc&limit=1';

const Home = () => {
  const navigate = useNavigate();
  
  //ESTATS
  const [recomanats, setRecomenats] = useState([]);
  const [repte, setRepte] = useState([]);

  const [ultimVisitat, setUltimVisitat] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    // Fetch RECOMANATS
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

    //Fetch REPTE DEL MES
    const fetchRepte = async () => {
      try {
        const response = await fetch(URL_REPTE, {
          method: "GET",
          headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` }
        });
        const data = await response.json();
        setRepte(data); // Guardem l'array (que segurament tindrà 1 sol element)
      } catch (error) {
        console.error("Error repte:", error);
      }
    };

    //Fetch DIARI

    //Fetch ULTIM ARBRE VISITAT
    const fetchUltimVisitat = async () => {
      try {
        const response = await fetch(URL_ULTIM_VISITAT, {
          method: "GET",
          headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` }
        });
        const data = await response.json();
        setUltimVisitat(data); 
      } catch (error) {
        console.error("Error ultim visitat:", error);
      }
    };


    //---------------
    //EXECUCIÓ GLOBAL
    //---------------
    const carregarTot = async () => {
      setLoading(true);
      
      // Aquí cridem a totes les funcions
      await fetchRecomanats();
      await fetchRepte();
      //DIARI
      await fetchUltimVisitat();     
      setLoading(false);
    };

    carregarTot();

  }, []);


  if (loading) return <div>Carregant Home...</div>;

  return (
    <div className="home-container">
      <Header />
      <Divider />

      {/* --- SECCIÓ 1: ARBRES RECOMANATS --- */}
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

      <Divider />
      
      {/* --- SECCIÓ 2: REPTE DEL MES --- */}

      <section className="home-section">
        <h2 className="section-title">REPTE DEL MES</h2>
        
        {repte.map((item) => (
          <div key={item.id} style={{ width: '100%' }}>
            
            {/* AQUI HA D'ANAR LA DATA AMB BOLD */}

            {/* Descripció sota el títol */}
            <p style={{ margin: '0px 0 5px 0', fontSize: '15px' }}>
              {item.descripcio}
            </p>

            {/* Cridem al TreeCard reutilitzable */}
            <TreeCard 
              id={item.arbre_id}
              
              name={item.arbres?.nom}
              titleColor="negre"
              
              municipality={item.arbres?.municipi}
              comarca={item.arbres?.comarques?.comarca}
              
              height={item.arbres?.alcada}
              trunkWidth={item.arbres?.gruix}
              crownWidth={item.arbres?.capcal}
              
              imageSrc={Avet} //borrar després  ----  imageSrc={item.arbres?.imatge || DefaultImage}
            />
          </div>
        ))}
      </section>
      
      <Divider />

      {/* --- SECCIÓ 3: DIARI --- */}
      <section className="home-section">
        <h2 className="section-title">DIARI</h2>
        
      </section>

      <Divider />

      {/* --- SECCIÓ 4: ÚLTIM ARBRE VISITAT --- */}

      <section className="home-section">
        <h2 className="section-title">ÚLTIM ARBRE VISITAT</h2>
        
        {ultimVisitat.length > 0 ? (
          ultimVisitat.map((item) => (
            <div key={item.arbre_id} style={{ width: '100%', marginBottom: '10px' }}>
              
              {/* Data en BOLD */}
              <p style={{ margin: '0px 0 0px 0', fontSize: '15px', fontWeight: 'bold' }}>
                {item.visita_data}
              </p>

              {/* Text de la visita (si n'hi ha) */}
              {item.visita_text && (
                <p style={{ margin: '0 0 5px 0', fontSize: '15px' }}>
                  {item.visita_text}
                </p>
              )}

              <TreeCard 
                id={item.arbre_id} 
                
                name={item.arbres?.nom}
                titleColor="negre" 
                
                municipality={item.arbres?.municipi}
                comarca={item.arbres?.comarques?.comarca} 
                
                height={item.arbres?.alcada}
                trunkWidth={item.arbres?.gruix}
                crownWidth={item.arbres?.capcal}
                
                imageSrc={Avet} //borrar després  ----  imageSrc={item.arbres?.imatge || DefaultImage}
              />
            </div>
          ))
        ) 
        : (
          <p>Encara no has visitat cap arbre.</p>
        )}
      </section>

      <Space />
    </div>
  );
};

export default Home;