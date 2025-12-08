import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ArbreDetail.css';
import Divider from '../components/Divider';
import Footer from '../components/Footer';
import Space from '../components/Space';

//ICONES (pendent de modificar estètica)
import CorBuit from '../assets/icons/PROV_Cor_BUIT.svg';
import CorPle from '../assets/icons/PROV_Cor_PLE.svg';
import PendentBuit from '../assets/icons/PROV_Pendent_BUIT.svg';
import PendentPle from '../assets/icons/PROV_Pendent_PLE.svg';
import UllBuit from '../assets/icons/PROV_Ull_BUIT.svg';
import UllPle from '../assets/icons/PROV_Ull_PLE.svg';

//ICONES ja bones
import iconLocation from '../assets/icons/Ubication.svg';
import iconHeight from '../assets/icons/Alcada.svg';
import iconTrunk from '../assets/icons/Amplada.svg';
import iconCrown from '../assets/icons/Capcal.svg';

//IMATGES
import DefaultImage from '../assets/icons/Imatge.svg';
import ImatgeProvisional from '../assets/FotosArbres/Avet de Canejan_2.png';


const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';


const ArbreDetall = () => {
  const { id } = useParams(); 
  const [arbre, setArbre] = useState(null);
  
  const [interaccio, setInteraccio] = useState({
    es_preferit: false,
    estat_llista: null // 'pendent', 'visitat' o null
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    //IMPORTANT TENIR-HO AQUÍ PQ SI HO TINC FORA DEL useEffect, ENCARA NO SAP L'ID
    const URL_ARBRE = `https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres?id=eq.${id}&select=nom,municipi,entorn,especie,alcada,gruix,capcal,coordenades,codi,imatge,any_proteccio,comarques(comarca),proteccio(tipus,descripcio)`;
    const URL_INTERACCIO = `https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/interaccions?arbre_id=eq.${id}&select=estat_preferit,estat_llista`;

const fetchData = async () => {
      try {
        // Fem les dues crides en paral·lel per anar més ràpid
        const [resArbre, resInteraccio] = await Promise.all([
          fetch(URL_ARBRE, { headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` } }),
          fetch(URL_INTERACCIO, { headers: { "apikey": API_KEY, "Authorization": `Bearer ${API_KEY}` } })
        ]);

        const dataArbre = await resArbre.json();
        const dataInteraccio = await resInteraccio.json();
        
        // GESTIÓ ARBRE
        if (dataArbre.length > 0) {
          setArbre(dataArbre[0]);
        }

        // GESTIÓ INTERACCIÓ
        if (dataInteraccio.length > 0) {
          // Si trobem dades, actualitzem l'estat
          setInteraccio({
            es_preferit: dataInteraccio[0].estat_preferit,
            estat_llista: dataInteraccio[0].estat_llista
          });
        } else {
          // Si no hi ha dades, vol dir que està tot a 0 (per defecte)
          setInteraccio({ es_preferit: false, estat_llista: null });
        }

      } catch (error) {
        console.error("Error carregant dades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  // 1. PREFERIT
  const isPreferit = interaccio.es_preferit === true;
  const iconaPreferit = isPreferit ? CorPle : CorBuit;
  const classPreferit = isPreferit ? "btn-interaccio actiu" : "btn-interaccio";

  // 2. VISITAT
  const isVisitat = interaccio.estat_llista === 'visitat';
  const iconaVisitat = isVisitat ? UllPle : UllBuit;
  const classVisitat = isVisitat ? "btn-interaccio actiu" : "btn-interaccio";

  // 3. PENDENT
  const isPendent = interaccio.estat_llista === 'pendent';
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
            
            {/* Preferit */}
            <div className={classPreferit}>
              <img src={iconaPreferit} alt="Preferit" style={{width:'24px'}}/>
              <span className="text-interaccio">Preferit</span>
            </div>

            {/* Visitat */}
            <div className={classVisitat}>
                <img src={iconaVisitat} alt="Visitat" style={{width:'24px'}}/>
                <span className="text-interaccio">Visitat</span>
            </div>

            {/* Pendent */}
            <div className={classPendent}>
                <img src={iconaPendent} alt="Pendent" style={{width:'24px'}}/>
                <span className="text-interaccio">Pendent</span>
            </div>

        </div>

        <Divider />

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