import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // IMPORT IMPORTANT: Fem servir el client, no fetch directe

import Header from '../components/Header'; 
import Divider from '../components/Divider';
import TreeCard from '../components/TreeCard';
import Space from '../components/Space';
import GraellaProgres from '../components/GraellaProgres';

import './Home.css';
//IMATGE PER DEFECTE errors de càrrega
import DefaultImage from '../assets/icons/Imatge.svg';

// CONSTANT PER LES IMATGES (Aquesta sí que la mantenim igual)
const STORAGE_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/storage/v1/object/public/fotos-arbres';

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
        // Fem servir supabase client
        const { data, error } = await supabase
            .from('arbres_recomenats')
            .select('id, arbre_id, arbres(nom, imatge)')
            .eq('recomenacio_estat', true)
            .order('id', { ascending: true });

        if (error) throw error;
        setRecomenats(data);
      } catch (error) {
        console.error("Error carregant recomanats:", error);
      }
    };

    //Fetch REPTE DEL MES
    const fetchRepte = async () => {
      try {
        const { data, error } = await supabase
            .from('arbre_repte_mensual')
            .select('id, descripcio, arbre_id, arbres(nom,municipi,alcada,gruix,capcal,comarques(comarca), imatge)')
            .eq('mes', '2025-12-01'); // Això potser ho hauràs de fer dinàmic en el futur

        if (error) throw error;
        setRepte(data); 
      } catch (error) {
        console.error("Error repte:", error);
      }
    };

    //Fetch DIARI
    // AQUI HI HA EL CANVI GRAN: Ara filtrem per usuari automàticament gràcies a RLS
    const fetchDiari = async () => {
        try {
            // 1. Total d'arbres (això és públic)
            const { count: totalArbres, error: errorTotal } = await supabase
                .from('arbres')
                .select('*', { count: 'exact', head: true });

            if (errorTotal) throw errorTotal;

            // 2. Interaccions de l'usuari (Supabase ja sap qui és l'usuari)
            const { data: dataInteraccions, error: errorInter } = await supabase
                .from('interaccions')
                .select('es_preferit, es_pendent, te_visites');

            if (errorInter) throw errorInter;

            // Calculem (ara dataInteraccions només té les dades del teu usuari)
            const countPreferits = dataInteraccions.filter(i => i.es_preferit).length;
            // Fem servir 'te_visites' que hem creat a la taula interaccions
            const countVisitats = dataInteraccions.filter(i => i.te_visites).length; 
            const countPendents = dataInteraccions.filter(i => i.es_pendent).length;

            setDiari({
                total: totalArbres || 0,
                preferits: countPreferits,
                visitats: countVisitats,
                pendents: countPendents
            });

        } catch (error) {
            console.error("Error carregant diari:", error);
        }
    };

    //Fetch ULTIM ARBRE VISITAT
    // CANVI: Ara busquem a la taula 'visites', no a 'interaccions'
    const fetchUltimVisitat = async () => {
      try {
        const { data, error } = await supabase
            .from('visites') // Taula nova
            .select('arbre_id, data_visita, text_visita, arbres(id,nom,municipi,alcada,gruix,capcal,comarques(comarca))')
            .order('data_visita', { ascending: false }) // Del més recent al més antic
            .limit(1);

        if (error) throw error;
        
        // Mapejem les dades perquè el format coincideixi amb el que espera el render
        // A la taula 'visites' tenim 'text_visita', al teu codi antic esperaves 'visita_text'.
        // Ho ajustem aquí o al render. Ho ajusto aquí:
        const dataMapejada = data.map(v => ({
            ...v,
            visita_text: v.text_visita // Adaptem el nom de la columna nova
        }));

        setUltimVisitat(dataMapejada); 
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
  // console.log("--------------------------------");
  // console.log("VITE_API_KEY:", import.meta.env.VITE_API_KEY);
  // console.log("TOTES LES ENV:", import.meta.env);
  // console.log("--------------------------------");

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
        <div style={{ width: '100%', marginTop: '5px', fontSize: '16px', color: 'var(--negre)' }}>
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

      {/* SECCIÓ 4: ÚLTIM ARBRE VISITAT  */}
      <section className="home-section">
        <h2 className="section-title">ÚLTIM ARBRE VISITAT</h2>
        
        {ultimVisitat.length > 0 ? (
          ultimVisitat.map((item) => (
            <div key={item.arbre_id} style={{ width: '100%', marginBottom: '10px' }}>
              
              {/* Data en BOLD */}
              <p style={{ margin: '0px 0 0px 0', fontSize: '15px', fontWeight: 'bold' }}>
                {item.data_visita} {/* Canviat de visita_data a data_visita segons la nova taula */}
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