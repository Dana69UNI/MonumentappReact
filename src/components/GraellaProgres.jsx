import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // IMPORT IMPORTANT
import './GraellaProgres.css';

import TreeIcon from '../assets/icons/Tree.svg?react';

const GraellaProgres = () => {
  const navigate = useNavigate();
  const [visitedIds, setVisitedIds] = useState(new Set());
  const [totalArbres, setTotalArbres] = useState(234); // Valor per defecte mentre carrega
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // 1. Obtenim el total d'arbres real de la base de dades
        // (Així si n'afegeixes més, la graella s'adapta sola)
        const { count, error: errorCount } = await supabase
            .from('arbres')
            .select('*', { count: 'exact', head: true });
        
            // per seguretat de si falla la consulta
            if (!errorCount && count) {
            setTotalArbres(count);
        }

        // 2. Obtenim els IDs dels arbres que tenen 'te_visites' a TRUE
        // Gràcies a RLS, això només retorna les files del teu usuari
        const { data, error } = await supabase
            .from('interaccions')
            .select('arbre_id')
            .eq('te_visites', true);

        if (error) throw error;

        // Creem un Set amb els IDs per fer cerques ràpides
        const ids = new Set(data.map(item => item.arbre_id));
        setVisitedIds(ids);

      } catch (error) {
        console.error("Error carregant graella:", error);
      }
    };

    fetchProgress();
  }, []);

  // Creem l'array dinàmicament segons el total de la DB
  const caselles = Array.from({ length: totalArbres }, (_, i) => i + 1);

  return (
    <div className="graella-container">
      {caselles.map((id) => {
        const isVisited = visitedIds.has(id);

        return (
          <div 
            key={id} 
            className="graella-item"
            onClick={() => navigate(`/cercar/${id}`)} 
            style={{ cursor: 'pointer' }} // Millora d'UX
          >
            {isVisited ? (
              <TreeIcon className="icona-arbre-graella"/>            
            ) : (
              <div className="cercle-graella"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GraellaProgres;