import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

//Aquestes estan aquí pq no patiran canvis (de la base aquesta)
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';
const URL_INTERACCIONS_UPDATE = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/interaccions?on_conflict=arbre_id';
//URL imatges
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
    es_visitat: false,
    visita_data: null,
    visita_text: null
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
    
    //IMPORTANT TENIR-HO AQUÍ PQ SI HO TINC FORA DEL useEffect, ENCARA NO SAP L'ID
    const URL_ARBRE = `https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres?id=eq.${id}&select=nom,municipi,entorn,especie,alcada,gruix,capcal,coordenades,codi,imatge,any_proteccio,comarques(comarca),proteccio(tipus,descripcio)`;
    const URL_INTERACCIO_READ = `https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/interaccions?arbre_id=eq.${id}&select=es_preferit,es_pendent,es_visitat,visita_data,visita_text`;    
    const URL_CHECK_REPTE = `https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbre_repte_mensual?arbre_id=eq.${id}&mes=eq.2025-12-01&select=descripcio`;
    const URL_CHECK_RECOMANAT = `https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres_recomenats?arbre_id=eq.${id}&recomenacio_estat=eq.true&select=descripcio`;

    const fetchData = async () => {
      try {
        // Fem les crides en paral·lel per anar més ràpid
        const [resArbre, resInteraccio, resRepte, resRecomanat] = await Promise.all([
          fetch(URL_ARBRE, { headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` } }),
          fetch(URL_INTERACCIO_READ, { headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` } }),
          fetch(URL_CHECK_REPTE, { headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` } }),
          fetch(URL_CHECK_RECOMANAT, { headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` } })
        ]);

        const dataArbre = await resArbre.json();
        const dataInteraccio = await resInteraccio.json();
        const dataRepte = await resRepte.json();
        const dataRecomanat = await resRecomanat.json();
        
        // GESTIÓ ARBRE
        if (dataArbre.length > 0) {
          setArbre(dataArbre[0]);
        }

        // GESTIÓ INTERACCIÓ
        if (dataInteraccio.length > 0) {
          setInteraccio({
            es_preferit: dataInteraccio[0].es_preferit,
            es_pendent: dataInteraccio[0].es_pendent,
            es_visitat: dataInteraccio[0].es_visitat,
            visita_data: dataInteraccio[0].visita_data,
            visita_text: dataInteraccio[0].visita_text
          });
        }
        
        //GESTIÓ RECOMAMATS I REPTE
        setEtiquetes({
            // Si hi ha dades, agafem la descripció. Si no, null.
            textRepte: dataRepte.length > 0 ? dataRepte[0].descripcio : null,
            textRecomanat: dataRecomanat.length > 0 ? dataRecomanat[0].descripcio : null
        });

      } catch (error) {
        console.error("Error carregant dades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  
  // --- FUNCIONS UPDATE ---
  const updateDatabase = async (campsActualitzats) => {
    try {
      const response = await fetch(URL_INTERACCIONS_UPDATE, {
        method: "POST",
        headers: { 
          "apikey": API_KEY, 
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify({
          arbre_id: id,
          ...campsActualitzats
        })
      });
      if (!response.ok) throw new Error("Error guardant");
    } catch (error) {
      console.error(error);
    }
  };

  const togglePreferit = async () => {
    const nouEstat = !interaccio.es_preferit;
    setInteraccio(prev => ({ ...prev, es_preferit: nouEstat }));
    await updateDatabase({ es_preferit: nouEstat });
  };

  const togglePendent = async () => {
    // Simplement invertim el valor de 'es_pendent'.
    // NO toquem 'es_visitat'. Són independents.
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
  if (interaccio.es_visitat) {
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
  const classVisitat = interaccio.es_visitat ? "btn-interaccio actiu" : "btn-interaccio";
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
                // Si està ple, hereta el color del pare (que serà blanc gràcies a .actiu)
                <CorPle style={{ width: '24px', color: 'currentColor' }} />
              ) : (
                // Si està buit, hereta el color del pare (que serà negre)
                <CorBuit style={{ width: '24px', color: 'currentColor' }} />
              )}
              <span className="text-interaccio">Preferit</span>
            </div>

            {/* VISITAT */}
            <div className={classVisitat} onClick={anarAFormulariVisita}>
                {interaccio.es_visitat ? (
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
        {(interaccio.es_visitat) && (
             <>
                <div className="info-bloc">
                    {/* Títol*/}
                    <span className="info-titol" style={{ color: 'var(--blau)', fontWeight: '700', fontSize:'20px' }}>
                        ARBRE VISITAT
                    </span>
                    
                    {/* Data */}
                    {interaccio.visita_data && (
                        <span className="info-valor" style={{ color: 'var(--negre)', fontWeight: '700', fontSize:'18px' }}>
                            {interaccio.visita_data}
                        </span>
                    )}

                    {/* Descripció (si n'hi ha) */}
                    {interaccio.visita_text && (
                        <span className="info-valor">
                            {interaccio.visita_text}
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