import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ArbreDetail.css';
import Divider from '../components/Divider';
import Space from '../components/Space';

import CorBuit from '../assets/icons/Like.svg';
import CorPle from '../assets/icons/Like_filled.svg';
import PendentBuit from '../assets/icons/Guardar.svg';
import PendentPle from '../assets/icons/Guardar_filled.svg';
import UllBuit from '../assets/icons/Ull.svg';
import UllPle from '../assets/icons/Ull_filled.svg';

import iconLocation from '../assets/icons/Ubication.svg';
import iconHeight from '../assets/icons/Alcada.svg';
import iconTrunk from '../assets/icons/Amplada.svg';
import iconCrown from '../assets/icons/Capcal.svg';

//IMATGES
import DefaultImage from '../assets/icons/Imatge.svg';
import ImatgeProvisional from '../assets/FotosArbres/Avet de Canejan_2.png';

//Aquestes estan aquí pq no patiran canvis (de la base aquesta)
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';
const URL_INTERACCIONS_UPDATE = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/interaccions?on_conflict=arbre_id';

const ArbreDetall = () => {
  const { id } = useParams(); 
  
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

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    
    //IMPORTANT TENIR-HO AQUÍ PQ SI HO TINC FORA DEL useEffect, ENCARA NO SAP L'ID
    const URL_ARBRE = `https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres?id=eq.${id}&select=nom,municipi,entorn,especie,alcada,gruix,capcal,coordenades,codi,imatge,any_proteccio,comarques(comarca),proteccio(tipus,descripcio)`;
    const URL_INTERACCIO_READ = `https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/interaccions?arbre_id=eq.${id}&select=es_preferit,es_pendent,es_visitat,visita_data,visita_text`;    const URL_CHECK_REPTE = `https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbre_repte_mensual?arbre_id=eq.${id}&mes=eq.2025-12-01&select=descripcio`;
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

  // --- NOVA LÒGICA PENDENT ---
  const togglePendent = async () => {
    // Simplement invertim el valor de 'es_pendent'.
    // NO toquem 'es_visitat'. Són independents.
    const nouEstat = !interaccio.es_pendent;
    setInteraccio(prev => ({ ...prev, es_pendent: nouEstat }));
    await updateDatabase({ es_pendent: nouEstat });
  };

  if (loading) return <div>Carregant detall...</div>;
  if (!arbre) return <div>Arbre no trobat!</div>;

  
  //--- PREPARACIÓ DE DADES ---
  //Imatge (Fem servir la provisional com has demanat, preparat pel futur)
  //const imatgeFinal = arbre.imatge || ImatgeProvisional;
  const imatgeFinal = ImatgeProvisional; 

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

  //PREFERIT
  const isPreferit = interaccio.es_preferit;
  const iconaPreferit = isPreferit ? CorPle : CorBuit;
  const classPreferit = isPreferit ? "btn-interaccio actiu" : "btn-interaccio";

  //VISITAT (Només lectura, no canvia en clicar)
  const isVisitat = interaccio.es_visitat;
  const iconaVisitat = isVisitat ? UllPle : UllBuit;
  const classVisitat = isVisitat ? "btn-interaccio actiu" : "btn-interaccio";

  //PENDENT (Independent)
  const isPendent = interaccio.es_pendent;
  const iconaPendent = isPendent ? PendentPle : PendentBuit;
  const classPendent = isPendent ? "btn-interaccio actiu" : "btn-interaccio";

  return (
    <div className="detall-container">
      
      {/*IMATGE */}
      <img src={imatgeFinal} alt={arbre.nom} className="detall-imatge-quadrada" />

      {/*CONTENIDOR INFO */}
      <div className="info-container">
        
        {/* Títol */}
        <h1 className="detall-titol">{arbre.nom}</h1>
        
        {/* Ubicació */}
        <div className="detall-ubicacio">
          <span className="text-ubicacio">
            {/* SVG */}
            <img src={iconLocation} alt="Ubicació" className="icona-inline"
            />
            {/* Text: municipi + comarca */}
            {arbre.municipi}, {arbre.comarques?.comarca}
          </span>
        </div>

        {/* --- BOTONS INTERACCIÓ DINÀMICS --- */}
        <div className="icones-interaccio">
            {/* PREFERIT */}
            <div className={classPreferit} onClick={togglePreferit}>
              <img src={iconaPreferit} alt="Preferit" style={{width:'24px'}}/>
              <span className="text-interaccio">Preferit</span>
            </div>

            {/* VISITAT (no és clicable, només mostra info) */}
            <div className={classVisitat}>
                <img src={iconaVisitat} alt="Visitat" style={{width:'24px'}}/>
                <span className="text-interaccio">Visitat</span>
            </div>

            {/* PENDENT */}
            <div className={classPendent} onClick={togglePendent}>
                <img src={iconaPendent} alt="Pendent" style={{width:'24px'}}/>
                <span className="text-interaccio">Pendent</span>
            </div>

        </div>

        <Divider />

        {/* --- BLOC: VISITAT (només si ho es) --- */}
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

        {/* --- BLOC: REPTE / RECOMANAT (només si ho son) --- */}
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
            {/* Alçària */}
            <div className="dim-item">
                <span className="dim-titol">Alçària</span>
                <div className="dim-valor-box">
                    <img src={iconHeight} alt="" style={{width:'24px'}}/>
                    <span className="dim-valor">{arbre.alcada}m</span>
                </div>
            </div>
            
            {/* Volta de canó (Gruix) */}
            <div className="dim-item">
                <span className="dim-titol">Volta de canó</span>
                <div className="dim-valor-box">
                    <img src={iconTrunk} alt="" style={{width:'24px'}}/>
                    <span className="dim-valor">{arbre.gruix}m</span>
                </div>
            </div>

            {/* Capçal */}
            <div className="dim-item">
                <span className="dim-titol">Capçal</span>
                <div className="dim-valor-box">
                    <img src={iconCrown} alt="" style={{width:'24px'}}/>
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