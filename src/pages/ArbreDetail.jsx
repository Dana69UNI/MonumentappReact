import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // IMPORT SUPABASE

import './ArbreDetail.css';
import Divider from '../components/Divider';
import Space from '../components/Space';

// ICONES
import CorBuit from '../assets/icons/Like.svg?react';
import CorPle from '../assets/icons/Like_filled.svg?react';
import PendentBuit from '../assets/icons/Guardar.svg?react';
import PendentPle from '../assets/icons/Guardar_filled.svg?react';
import UllBuit from '../assets/icons/Ull.svg?react';
import UllPle from '../assets/icons/Ull_filled.svg?react';

import IconLocation from '../assets/icons/Ubication.svg?react';
import IconHeight from '../assets/icons/Alcada.svg?react';
import IconTrunk from '../assets/icons/Amplada.svg?react';
import IconCrown from '../assets/icons/Capcal.svg?react';

import IconBack from '../assets/icons/Enrere.svg?react';

//IMATGES
import DefaultImage from '../assets/icons/Imatge.svg';
import VisitatPlaceholder from '../assets/Visitat.jpg';

//URL imatges (Aquesta es manté)
const STORAGE_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/storage/v1/object/public/fotos-arbres';

const ArbreDetall = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  //PER DADES ARBRES
  const [arbre, setArbre] = useState(null);
  
  //PER GESTIÓ INTERACCIONS
  const [interaccio, setInteraccio] = useState({
    es_preferit: false,
    es_pendent: false,
    te_visites: false, // Canviat de 'es_visitat' a 'te_visites' per la nova estructura
    ultima_visita_data: null, // Per mostrar la data
    ultima_visita_text: null
  });

  //PER GESTIÓ RECOMANATS I REPTE
  const [etiquetes, setEtiquetes] = useState({
    textRepte: null,
    textRecomanat: null
  });

  //Carrusel d'imatges
  const [currentSlide, setCurrentSlide] = useState(0);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    
    const fetchData = async () => {
      try {
        // 1. DADES DE L'ARBRE (Públic)
        const { data: dataArbre, error: errorArbre } = await supabase
            .from('arbres')
            .select('nom,municipi,entorn,especie,alcada,gruix,capcal,coordenades,codi,imatge,any_proteccio,comarques(comarca),proteccio(tipus,descripcio)')
            .eq('id', id)
            .single();

        if (errorArbre) throw errorArbre;
        setArbre(dataArbre);


        // 2. INTERACCIONS (Privat - RLS filtrarà per l'usuari)
        const { data: dataInteraccio, error: errorInteraccio } = await supabase
            .from('interaccions')
            .select('es_preferit, es_pendent, te_visites')
            .eq('arbre_id', id)
            .maybeSingle(); // maybeSingle no dona error si no troba res (retorna null)

        if (errorInteraccio) throw errorInteraccio;

        // 3. SI TÉ VISITES, BUSQUEM L'ÚLTIMA (Per mostrar la info extra)
        let ultimaVisita = { data: null, text: null };
        if (dataInteraccio?.te_visites) {
            const { data: dataVisites } = await supabase
                .from('visites')
                .select('data_visita, text_visita')
                .eq('arbre_id', id)
                .order('data_visita', { ascending: false })
                .limit(1)
                .single();
            
            if (dataVisites) {
                ultimaVisita = { data: dataVisites.data_visita, text: dataVisites.text_visita };
            }
        }

        // Setegem estat Interacció
        if (dataInteraccio) {
            setInteraccio({
                es_preferit: dataInteraccio.es_preferit,
                es_pendent: dataInteraccio.es_pendent,
                te_visites: dataInteraccio.te_visites,
                ultima_visita_data: ultimaVisita.data,
                ultima_visita_text: ultimaVisita.text
            });
        }

        // 4. CHECK REPTE (Públic)
        const { data: dataRepte } = await supabase
            .from('arbre_repte_mensual')
            .select('descripcio')
            .eq('arbre_id', id)
            .eq('mes', '2025-12-01');

        // 5. CHECK RECOMANAT (Públic)
        const { data: dataRecomanat } = await supabase
            .from('arbres_recomenats')
            .select('descripcio')
            .eq('arbre_id', id)
            .eq('recomenacio_estat', true);
        
        // GESTIÓ ETIQUETES
        setEtiquetes({
            textRepte: dataRepte && dataRepte.length > 0 ? dataRepte[0].descripcio : null,
            textRecomanat: dataRecomanat && dataRecomanat.length > 0 ? dataRecomanat[0].descripcio : null
        });

      } catch (error) {
        console.error("Error carregant dades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  
  // --- FUNCIONS UPDATE (Ara amb Supabase) ---
  const updateDatabase = async (campsActualitzats) => {
    try {
        // Necessitem saber el user_id per fer l'upsert correctament
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Si no hi ha usuari, no fem res

        // Fem UPSERT: Si existeix actualitza, si no existeix crea
        const { error } = await supabase
            .from('interaccions')
            .upsert({ 
                user_id: user.id,
                arbre_id: id,
                ...campsActualitzats
            }, { onConflict: 'user_id, arbre_id' }); // Clau per detectar duplicats

        if (error) throw error;
    } catch (error) {
      console.error("Error guardant:", error);
    }
  };

  const togglePreferit = async () => {
    const nouEstat = !interaccio.es_preferit;
    setInteraccio(prev => ({ ...prev, es_preferit: nouEstat }));
    await updateDatabase({ es_preferit: nouEstat });
  };

  const togglePendent = async () => {
    // Simplement invertim el valor de 'es_pendent'.
    const nouEstat = !interaccio.es_pendent;
    setInteraccio(prev => ({ ...prev, es_pendent: nouEstat }));
    await updateDatabase({ es_pendent: nouEstat });
  };

  const anarAFormulariVisita = () => {
    // Naveguem a /nou
    // Passem l'ID per si volem pre-omplir el formulari
    navigate('/nou', { 
      state: { 
        arbreIdPerVisitar: id, 
      } 
    });
  };

  //Botó enrere
  const handleGoBack = () => {
    navigate(-1);
  };

  //Control de la posició del carrusel 
  const handleScroll = (e) => {
    const width = e.target.offsetWidth; // Amplada del contenidor
    const scrollPos = e.target.scrollLeft; // Posició de l'scroll
    // Calculem l'índex arrodonint la divisió
    const index = Math.round(scrollPos / width);
    setCurrentSlide(index);
  };


  if (loading) return <div>Carregant detall...</div>;
  if (!arbre) return <div>Arbre no trobat!</div>;

  
  //PREPARACIÓ DE DADES (imatges i text)
  let imatgesGaleria = [];

  //Si està visitat, la primera és la de l'usuari (Placeholder pel test)
  if (interaccio.te_visites) {
      imatgesGaleria.push(VisitatPlaceholder);
  }

  //Després sempre van Original i Sketch
  imatgesGaleria.push(`${STORAGE_URL}/${id}_Original.jpg`);
  imatgesGaleria.push(`${STORAGE_URL}/${id}_Sketch.png`);

  //Donem estil: "Monumental, Parc Nacional - 1995"
  let textProteccio = "-";
  if (arbre.proteccio && arbre.proteccio.length > 0) {
    //Ajuntem les descripcions amb comes
    const nomsProteccio = arbre.proteccio.map(p => p.descripcio).join(', ');
    //Afegim l'any si existeix
    textProteccio = arbre.any_proteccio 
      ? `${nomsProteccio} - ${arbre.any_proteccio}` 
      : nomsProteccio;
  }

  //DETERMINEM QUINES ICONES I CLASSES TOQUEN
  const classPreferit = interaccio.es_preferit ? "btn-interaccio actiu" : "btn-interaccio";
  const classVisitat = interaccio.te_visites ? "btn-interaccio actiu" : "btn-interaccio";
  const classPendent = interaccio.es_pendent ? "btn-interaccio actiu" : "btn-interaccio";
  
  return (
    <div className="detall-container">
      
      {/* BOTÓ ENRERE */}
      <div className="btn-enrere" onClick={handleGoBack}>
        <IconBack style={{ color: 'var(--blanc)', width: '25px', height: '25px' }} />
      </div>
      
      {/* CARRUSEL D'IMATGES */}
      <div className="carousel-container">
        
        {/* Pista lliscant amb event de scroll */}
        <div className="carousel-slider" onScroll={handleScroll}>
            {imatgesGaleria.map((imgSrc, index) => (
                <img 
                    key={index}
                    src={imgSrc} 
                    alt={`Arbre ${index}`} 
                    className="carousel-image" 
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = DefaultImage; 
                    }}
                />
            ))}
        </div>

        {/* Puntets */}
        <div className="carousel-dots">
            {imatgesGaleria.map((_, index) => (
                <div 
                    key={index} 
                    className={`dot ${currentSlide === index ? 'active' : ''}`}
                ></div>
            ))}
        </div>

      </div>

      {/* CONTENIDOR INFO */}
      <div className="info-container">
        
        {/* Títol */}
        <h1 className="detall-titol">{arbre.nom}</h1>
        
        {/* Ubicació */}
        <div className="detall-ubicacio">
          <span className="text-ubicacio">
            <IconLocation 
                className="icona-inline" 
                style={{ color: 'var(--negre)' }} 
            />
            {arbre.municipi}, {arbre.comarques?.comarca}
          </span>
        </div>

        {/* BOTONS INTERACCIÓ  */}
        <div className="icones-interaccio">
            
            {/* PREFERIT */}
            <div className={classPreferit} onClick={togglePreferit}>
              {interaccio.es_preferit ? (
                <CorPle style={{ width: '24px', color: 'currentColor' }} />
              ) : (
                <CorBuit style={{ width: '24px', color: 'currentColor' }} />
              )}
              <span className="text-interaccio">Preferit</span>
            </div>

            {/* VISITAT */}
            <div className={classVisitat} onClick={anarAFormulariVisita}>
                {interaccio.te_visites ? (
                    <UllPle style={{ width: '24px', color: 'currentColor' }} />
                ) : (
                    <UllBuit style={{ width: '24px', color: 'currentColor' }} />
                )}
                <span className="text-interaccio">Visitat</span>
            </div>

            {/* PENDENT */}
            <div className={classPendent} onClick={togglePendent}>
                {interaccio.es_pendent ? (
                    <PendentPle style={{ width: '24px', color: 'currentColor' }} />
                ) : (
                    <PendentBuit style={{ width: '24px', color: 'currentColor' }} />
                )}
                <span className="text-interaccio">Pendent</span>
            </div>

        </div>

        <Divider />

        {/* VISITAT (només si ho es) */}
        {(interaccio.te_visites) && (
             <>
                <div className="info-bloc">
                    {/* Títol*/}
                    <span className="info-titol" style={{ color: 'var(--blau)', fontWeight: '700', fontSize:'20px' }}>
                        ARBRE VISITAT
                    </span>
                    
                    {/* Data */}
                    {interaccio.ultima_visita_data && (
                        <span className="info-valor" style={{ color: 'var(--negre)', fontWeight: '700', fontSize:'18px' }}>
                            {interaccio.ultima_visita_data}
                        </span>
                    )}

                    {/* Descripció (si n'hi ha) */}
                    {interaccio.ultima_visita_text && (
                        <span className="info-valor">
                            {interaccio.ultima_visita_text}
                        </span>
                    )}
                </div>
                <Divider />
             </>
        )}

        {/* BLOC: REPTE / RECOMANAT (només si ho son) */}
        {(etiquetes.textRepte || etiquetes.textRecomanat) && (
            <>
                {/* Repte del Mes */}
                {etiquetes.textRepte && (
                    <div className="info-bloc">
                        <span className="info-titol">REPTE DEL MES</span>
                        <span className="info-valor">{etiquetes.textRepte}</span>
                    </div>
                )}

                {/* Arbre Recomanat */}
                {etiquetes.textRecomanat && (
                    <div className="info-bloc">
                        <span className="info-titol">ARBRE RECOMANAT</span>
                        <span className="info-valor">{etiquetes.textRecomanat}</span>
                    </div>
                )}
                
                <Divider /> 
            </>
        )}
        {/* Dimensions */}
        <div className="dimensions-container">
            <div className="dim-item">
                <span className="dim-titol">Alçària</span>
                <div className="dim-valor-box">
                    <IconHeight style={{ width: '24px', color: 'var(--negre)' }} />
                    <span className="dim-valor">{arbre.alcada}m</span>
                </div>
            </div>
            <div className="dim-item">
                <span className="dim-titol">Volta de canó</span>
                <div className="dim-valor-box">
                    <IconTrunk style={{ width: '24px', color: 'var(--negre)' }} />
                    <span className="dim-valor">{arbre.gruix}m</span>
                </div>
            </div>
            <div className="dim-item">
                <span className="dim-titol">Capçal</span>
                <div className="dim-valor-box">
                    <IconCrown style={{ width: '24px', color: 'var(--negre)' }} />
                    <span className="dim-valor">{arbre.capcal}m</span>
                </div>
            </div>
        </div>
        <Divider />

        {/* INFO EXTRA*/}
        
        {/* Entorn (només si n'hi ha) */}
        {arbre.entorn && (
           <div className="info-bloc">
               <span className="info-titol">Entorn</span>
               <span className="info-valor">{arbre.entorn}</span>
           </div>
        )}

        {/* Coordenades */}
        <div className="info-bloc">
            <span className="info-titol">Coordenades</span>
            <span className="info-valor">{arbre.coordenades}</span>
        </div>

        {/* Espècie */}
        <div className="info-bloc">
            <span className="info-titol">Espècie</span>
            <span className="info-valor" style={{ fontStyle: 'italic' }}>
                {arbre.especie}
            </span>
        </div>

        {/* Protecció */}
        <div className="info-bloc">
            <span className="info-titol">Protecció</span>
            <span className="info-valor">{textProteccio}</span>
        </div>

        {/* Codi Protecció */}
        <div className="info-bloc">
            <span className="info-titol">Codi de protecció</span>
            <span className="info-valor">{arbre.codi}</span>
        </div>
      </div>
      <Space/>
    </div>
  );
};

export default ArbreDetall;