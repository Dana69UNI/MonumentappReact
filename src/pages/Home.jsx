import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; 
import Divider from '../components/Divider';
import TreeCard from '../components/TreeCard';
import Space from '../components/Space';
import GraellaProgres from '../components/GraellaProgres';

import './Home.css';
//IMATGE PER DEFECTE errors de càrrega
import DefaultImage from '../assets/icons/Imatge.svg';


//API
const API_KEY = import.meta.env.VITE_API_KEY;
const URL_RECOMANATS = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres_recomenats?recomenacio_estat=eq.true&select=id,arbre_id,arbres(nom, imatge)&order=id.asc';
const URL_REPTE = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbre_repte_mensual?mes=eq.2025-12-01&select=id,descripcio,arbre_id,arbres(nom,municipi,alcada,gruix,capcal,comarques(comarca), imatge)';
const URL_ULTIM_VISITAT = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/interaccions?es_visitat=eq.true&select=arbre_id,visita_data,visita_text,arbres(id,nom,municipi,alcada,gruix,capcal,comarca_id,comarques(comarca))&order=visita_data.desc&limit=1';
//Imatges Supabase
const STORAGE_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/storage/v1/object/public/fotos-arbres';

// Demanem només els camps necessaris per fer els càlculs
const URL_COUNT_INTERACCIONS = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/interaccions?select=es_preferit,es_visitat,es_pendent';
const URL_COUNT_TOTAL = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres?select=id'; // Només IDs per saber el total

const Home = () => {
  const navigate = useNavigate();
  
  //ESTATS
  const [recomanats, setRecomenats] = useState([]);
  const [repte, setRepte] = useState([]);
  const [ultimVisitat, setUltimVisitat] = useState([]);

  // DIARI
  const [diari, setDiari] = useState({
    total: 0,
    preferits: 0,
    visitats: 0,
    pendents: 0
  });

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
    const fetchDiari = async () => {
        try {
            // Fem dues crides en paral·lel: Total d'arbres i Totes les interaccions
            const [resTotal, resInteraccions] = await Promise.all([
                fetch(URL_COUNT_TOTAL, { headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` } }),
                fetch(URL_COUNT_INTERACCIONS, { headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` } })
            ]);

            const dataTotal = await resTotal.json();
            const dataInteraccions = await resInteraccions.json();

            // Calculem
            const totalArbres = dataTotal.length; // Denominador (ex: 234)
            
            // Sumem quants true hi ha a cada categoria
            const countPreferits = dataInteraccions.filter(i => i.es_preferit).length;
            const countVisitats = dataInteraccions.filter(i => i.es_visitat).length;
            const countPendents = dataInteraccions.filter(i => i.es_pendent).length;

            setDiari({
                total: totalArbres,
                preferits: countPreferits,
                visitats: countVisitats,
                pendents: countPendents
            });

        } catch (error) {
            console.error("Error carregant diari:", error);
        }
    };

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
      await fetchDiari();
      await fetchUltimVisitat();     
      setLoading(false);
    };
    carregarTot();
  }, []);

  // ... dins del component Home
  console.log("--------------------------------");
  console.log("VITE_API_KEY:", import.meta.env.VITE_API_KEY);
  console.log("TOTES LES ENV:", import.meta.env);
  console.log("--------------------------------");

  if (loading) return <div>Carregant Home...</div>;

  return (
    <div className="home-container">
      <Header />
      <Divider />

    {/* SECCIÓ 1: ARBRES RECOMANATS */}
      <section className="home-section">
        <h2 className="section-title">ARBRES RECOMANATS</h2>
        
        <div className="horizontal-scroll-container">
          {/* Afegim 'index' al map per saber si és el 0, el 1, el 2... */}
          {recomanats.map((item) => {
            
            //Construïm la URL de la imatge
            const imatgeSupabase = `${STORAGE_URL}/${item.arbre_id}_Sketch.png`;

            return (
              <div 
                key={item.id} 
                className="recommended-item"
                onClick={() => navigate(`/cercar/${item.arbre_id}`)} 
              >
                <img src={imatgeSupabase} alt={item.arbres?.nom} className="rec-image" onError={(e) => {
                  // GESTIÓ D'ERRORS: Si falla Supabase, posem la DefaultImage
                      e.target.onerror = null; 
                      e.target.src = DefaultImage; 
                  }}
                />
                <span className="rec-name">{item.arbres?.nom}</span>
              </div>
            );
          })}
        </div>
      </section>

      <Divider />
      
      {/* SECCIÓ 2: REPTE DEL MES */}

      <section className="home-section">
        <h2 className="section-title">REPTE DEL MES</h2>
        
        {repte.map((item) => (
          <div key={item.id} style={{ width: '100%' }}>
            
            {/* Descripció sota el títol */}
            <p style={{ margin: '0px 0 5px 0', fontSize: '15px' }}>
              {item.descripcio}
            </p>

            {/* Cridem al TreeCard compoent */}
            <TreeCard 
              id={item.arbre_id}
              name={item.arbres?.nom}
              titleColor="negre"
              municipality={item.arbres?.municipi}
              comarca={item.arbres?.comarques?.comarca}
              height={item.arbres?.alcada}
              trunkWidth={item.arbres?.gruix}
              crownWidth={item.arbres?.capcal}              
            />
          </div>
        ))}
      </section>
      
      <Divider />

      {/* SECCIÓ 3: DIARI (arreglar en un futur) */}
      <section className="home-section">
        <h2 className="section-title">DIARI</h2>

        {/* Text simple (sense icona. S'haurà de canviar en un futur) */}
        <div style={{ marginTop: '5px', fontSize: '16px', color: 'var(--negre)' }}>
            <p style={{ margin: '5px 0' }}>
                Preferits: <strong>{diari.preferits}/{diari.total}</strong>
            </p>

            <p style={{ margin: '5px 0' }}>
                Visitats: <strong>{diari.visitats}/{diari.total}</strong>
            </p>

            <p style={{ margin: '5px 0' }}>
                Pendents: <strong>{diari.pendents}/{diari.total}</strong>
            </p>

            {/* Graella de progrés */}
            <div style={{ width: '100%', marginTop: '10px' }}>
              <GraellaProgres />
            </div>
            
        </div>
      </section>

      <Divider />

      {/*  SECCIÓ 4: ÚLTIM ARBRE VISITAT  */}
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