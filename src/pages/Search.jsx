import React, { useState, useEffect } from 'react';
import './Search.css';
import TreeCard from '../components/TreeCard.jsx';
import Divider from '../components/Divider.jsx';
import Space from '../components/Space.jsx';

import IconSearch from '../assets/icons/Search.svg?react';
import IconFilter from '../assets/icons/Filtre.svg?react';
import IconOrder from '../assets/icons/Ordenar.svg?react';
// Icones necessàries per ordre (encara que ara ens centrem en filtre)
import IconHeight from '../assets/icons/Alcada.svg?react';
import IconTrunk from '../assets/icons/Amplada.svg?react';
import IconCrown from '../assets/icons/Capcal.svg?react';
import Tree from '../assets/icons/Tree.svg?react';
// Fletxa per als desplegables
import Fletxa from '../assets/icons/Enrere.svg?react';

// URL i KEY correctes
// Nota: Utilitzem 'estat' perquè així està a la select, tot i que a la descripció deies arbres_estat.
const API_URL = 'https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres?select=id,nom,municipi,alcada,gruix,capcal,estat,comarques(comarca),proteccio(tipus)&order=id.asc';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q';

const Search = () => {
  const [posts, setPosts] = useState([]); // Inicialitzem com array buit []
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- ESTATS NOUS PER FILTRES ---
  const [showFilters, setShowFilters] = useState(false); // Per obrir/tancar el panell
  const [showSort, setShowSort] = useState(false); // Per obrir/tancar el panell ORDENAR
  
  // Dades úniques per als selects
  const [llistaComarques, setLlistaComarques] = useState([]);
  const [llistaProteccio, setLlistaProteccio] = useState([]);

  // Filtres APLICATS (els que realment filtren la llista)
  const [appliedFilters, setAppliedFilters] = useState({
    comarca: '',
    proteccio: '',
    estat: 'tots' // 'tots', 'viu' (true), 'mort' (false)
  });

  // Filtres TEMPORALS (els que veiem al menú mentre triem)
  const [tempFilters, setTempFilters] = useState({
    comarca: '',
    proteccio: '',
    estat: 'tots'
  });

  // --- ESTAT PER ORDENAR ---
  // null = Recomanat (ordre per defecte)
  // { field: 'alcada', direction: 'desc' } ...
  const [sortOrder, setSortOrder] = useState(null);


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
          throw new Error('Error connectant amb la Base de Dades');
        }

        const data = await response.json();
        setPosts(data);

        // Extreure llistes úniques per als filtres
        const comarquesUniques = [...new Set(data.map(a => a.comarques?.comarca).filter(Boolean))].sort();
        setLlistaComarques(comarquesUniques);

        const proteccionsRaw = data.flatMap(a => a.proteccio?.map(p => p.tipus) || []);
        const proteccionsUniques = [...new Set(proteccionsRaw)].sort();
        setLlistaProteccio(proteccionsUniques);

      } catch (err) {
        console.error(err);
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchPosts(); 
  }, []); 

  // --- HANDLERS FILTRES ---

  const toggleFilterPanel = () => {
    if (showSort) setShowSort(false); // Si ordre està obert, el tanquem

    if (!showFilters) {
        // Al obrir, sincronitzem els temporals amb els aplicats
        setTempFilters(appliedFilters);
    }
    setShowFilters(!showFilters);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const resetState = { comarca: '', proteccio: '', estat: 'tots' };
    setTempFilters(resetState);
    setAppliedFilters(resetState);
    // No tanquem el panell automàticament al borrar
  };

  // --- HANDLERS ORDENAR ---
  const toggleSortPanel = () => {
    if (showFilters) setShowFilters(false); // Si filtres està obert, el tanquem
    setShowSort(!showSort);
  }

  // Funció per seleccionar un ordre
  const handleSelectSort = (field, direction) => {
    if (field === 'recomanat') {
        setSortOrder(null);
    } else {
        setSortOrder({ field, direction });
    }
    setShowSort(false); // Tanquem panell directament en clicar
  }

  // Determinem si hi ha filtres actius per pintar la icona de blau
  const hasActiveFilters = appliedFilters.comarca !== '' || appliedFilters.proteccio !== '' || appliedFilters.estat !== 'tots';
  
  // Determinem si l'ordre està actiu (no és recomanat/null)
  const hasActiveSort = sortOrder !== null;


  //FILTRATGE I ORDENACIÓ
  //variable que només tindrà els arbres que coincideixin amb la cerca, filtres i ordre.
  
  // 1. FILTREM
  let processedPosts = posts.filter((arbre) => {
    // 1. Text Search
    let matchesSearch = true;
    if (searchTerm !== '') {
        const term = searchTerm.toLowerCase();
        const matchNom = arbre.nom?.toLowerCase().includes(term);
        const matchMunicipi = arbre.municipi?.toLowerCase().includes(term);
        const matchComarca = arbre.comarques?.comarca?.toLowerCase().includes(term);
        matchesSearch = matchNom || matchMunicipi || matchComarca;
    }

    // 2. Filtres
    // Comarca
    let matchesComarca = true;
    if (appliedFilters.comarca !== '') {
        matchesComarca = arbre.comarques?.comarca === appliedFilters.comarca;
    }

    // Proteccio
    let matchesProteccio = true;
    if (appliedFilters.proteccio !== '') {
        matchesProteccio = arbre.proteccio?.some(p => p.tipus === appliedFilters.proteccio);
    }

    // Estat
    let matchesEstat = true;
    if (appliedFilters.estat !== 'tots') {
        const estatBuscat = appliedFilters.estat === 'viu'; // true si viu, false si mort
        matchesEstat = arbre.estat === estatBuscat;
    }

    return matchesSearch && matchesComarca && matchesProteccio && matchesEstat;
  });

  // 2. ORDENEM (Si cal)
  if (sortOrder) {
      const { field, direction } = sortOrder;
      processedPosts.sort((a, b) => {
          const valA = a[field] || 0; // Tractem nulls com 0
          const valB = b[field] || 0;
          
          if (direction === 'asc') return valA - valB; // De petit a gran
          else return valB - valA; // De gran a petit
      });
  }


  // NOU BLOQUEIG DE SCROLL (Si qualsevol dels dos modals està obert)
  useEffect(() => {
    if (showFilters || showSort) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showFilters, showSort]);


  if (loading) {
    return <div>Carregant Arbres...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    // CONTENIDOR PRINCIPAL
    <div className="search-page-container"> 
          
      {/* BARRA DE CERCA */}
      <div className="search-bar">
        {/* Icona de color negre fluix */}
        <IconSearch style={{ width: '50px', color: 'var(--negre-fluix)' }} />
        
        <input type="text" className="search-input" placeholder="Cercar arbre, comarca o municipi" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Actualitzem estat al escriure
        />
      </div>

      {/* FILTRAR I ORDENAR */}
      {/* FILTRAR I ORDENAR */}
      <div className="actions-container">
        
        {/* Botó Filtrar */}
        <div 
            className="action-item" 
            onClick={toggleFilterPanel} 
            style={{ cursor: 'pointer' }}
        >
            <IconFilter 
                style={{ 
                    width: '30px', 
                    // 1. Si Ordenar obert -> fluix. 2. Si Filtres obert o actius -> blau. 3. Sino -> negre
                    color: showSort ? 'var(--negre-fluix)' : (showFilters || hasActiveFilters ? 'var(--blau)' : 'var(--negre)') 
                }} 
            />
            <span 
                className="action-text" 
                style={{ 
                    color: showSort ? 'var(--negre-fluix)' : (showFilters || hasActiveFilters ? 'var(--blau)' : 'var(--negre)') 
                }}
            >
                Filtrar
            </span>
        </div>

        {/* Separador Vertical */}
        {/* Opcional: També el pots posar fluix si vols, però negre està bé */}
        <div className="vertical-sep"></div>

        {/* Botó Ordenar */}
        <div 
            className="action-item" 
            onClick={toggleSortPanel} 
            style={{ cursor: 'pointer' }}
        >
            <IconOrder 
                style={{ 
                    width: '30px', 
                    // 1. Si Filtres obert -> fluix. 2. Si Ordenar obert o actiu -> blau. 3. Sino -> negre
                    color: showFilters ? 'var(--negre-fluix)' : (showSort || hasActiveSort ? 'var(--blau)' : 'var(--negre)') 
                }} 
            />
            <span 
                className="action-text" 
                style={{ 
                    color: showFilters ? 'var(--negre-fluix)' : (showSort || hasActiveSort ? 'var(--blau)' : 'var(--negre)') 
                }}
            >
                Ordenar
            </span>
        </div>

      </div>

      {/* --- PANELL DE FILTRES (DESPLEGABLE) --- */}
      {showFilters && (
        <>
            {/* OVERLAY NEGRE */}
            <div className="filters-overlay" onClick={() => setShowFilters(false)}></div>

            <div className="filters-panel">
                
                {/* 1. Desplegable Comarca */}
                <div className={`custom-select-container ${tempFilters.comarca ? 'actiu' : ''}`}>
                    <select 
                        value={tempFilters.comarca} 
                        onChange={(e) => setTempFilters({...tempFilters, comarca: e.target.value})}
                    >
                        <option value="">Comarca</option> {/* Placeholder */}
                        {llistaComarques.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {/* Icona fletxa customitzada a la dreta */}
                    <Fletxa className="select-arrow" />
                </div>

                {/* 2. Desplegable Protecció */}
                <div className={`custom-select-container ${tempFilters.proteccio ? 'actiu' : ''}`}>
                    <select 
                        value={tempFilters.proteccio} 
                        onChange={(e) => setTempFilters({...tempFilters, proteccio: e.target.value})}
                    >
                        <option value="">Protecció</option> {/* Placeholder */}
                        {llistaProteccio.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <Fletxa className="select-arrow" />
                </div>

                {/* 3. Botons Estat (Tots, Vius, Morts) */}
                <div className="estat-buttons-container">
                    <button 
                        className={`estat-btn ${tempFilters.estat === 'tots' ? 'actiu' : ''}`}
                        onClick={() => setTempFilters({...tempFilters, estat: 'tots'})}
                    >Tots</button>
                    <button 
                        className={`estat-btn ${tempFilters.estat === 'viu' ? 'actiu' : ''}`}
                        onClick={() => setTempFilters({...tempFilters, estat: 'viu'})}
                    >Vius</button>
                    <button 
                        className={`estat-btn ${tempFilters.estat === 'mort' ? 'actiu' : ''}`}
                        onClick={() => setTempFilters({...tempFilters, estat: 'mort'})}
                    >Morts</button>
                </div>

                {/* 4. Botons Acció (Borrar / Aplicar) */}
                <div className="filter-actions-row">
                    <button className="btn-borrar" onClick={handleClearFilters}>
                        Borrar filtres
                    </button>
                    <button className="btn-aplicar" onClick={handleApplyFilters}>
                        Aplicar
                    </button>
                </div>

            </div>
        </>
      )}


      {/* --- PANELL D'ORDENAR (DESPLEGABLE DRETA) --- */}
      {showSort && (
          <>
             {/* OVERLAY NEGRE (Comparteix estil amb filtres) */}
             <div className="filters-overlay" onClick={() => setShowSort(false)}></div>

             <div className="sort-panel">
                
                {/* 1. RECOMANAT (Default) */}
                <button 
                    className={`sort-option-btn ${sortOrder === null ? 'actiu' : ''}`}
                    onClick={() => handleSelectSort('recomanat', '')}
                >
                    <Tree style={{ width: '25px', height: '25px', color: 'currentColor' }} />
                    <span>Recomanat</span>
                </button>

                {/* 2. ALÇADA (Alt -> Baix) */}
                <button 
                    className={`sort-option-btn ${sortOrder?.field === 'alcada' && sortOrder?.direction === 'desc' ? 'actiu' : ''}`}
                    onClick={() => handleSelectSort('alcada', 'desc')}
                >
                    <IconHeight style={{ width: '25px', height: '25px', color: 'currentColor' }} />
                    <span>D'alt a baix</span>
                </button>

                {/* 3. ALÇADA (Baix -> Alt) */}
                <button 
                    className={`sort-option-btn ${sortOrder?.field === 'alcada' && sortOrder?.direction === 'asc' ? 'actiu' : ''}`}
                    onClick={() => handleSelectSort('alcada', 'asc')}
                >
                    <IconHeight style={{ width: '25px', height: '25px', color: 'currentColor' }} />
                    <span>De baix a alt</span>
                </button>

                {/* 4. GRUIX (Gruixut -> Prim) */}
                <button 
                    className={`sort-option-btn ${sortOrder?.field === 'gruix' && sortOrder?.direction === 'desc' ? 'actiu' : ''}`}
                    onClick={() => handleSelectSort('gruix', 'desc')}
                >
                    <IconTrunk style={{ width: '25px', height: '25px', color: 'currentColor' }} />
                    <span>De gruixut a prim</span>
                </button>

                {/* 5. GRUIX (Prim -> Gruixut) */}
                <button 
                    className={`sort-option-btn ${sortOrder?.field === 'gruix' && sortOrder?.direction === 'asc' ? 'actiu' : ''}`}
                    onClick={() => handleSelectSort('gruix', 'asc')}
                >
                    <IconTrunk style={{ width: '25px', height: '25px', color: 'currentColor' }} />
                    <span>De prim a gruixut</span>
                </button>

                {/* 6. CAPÇAL (Gran -> Petit) */}
                <button 
                    className={`sort-option-btn ${sortOrder?.field === 'capcal' && sortOrder?.direction === 'desc' ? 'actiu' : ''}`}
                    onClick={() => handleSelectSort('capcal', 'desc')}
                >
                    <IconCrown style={{ width: '25px', height: '25px', color: 'currentColor' }} />
                    <span>Capçal gran a petit</span>
                </button>

                {/* 7. CAPÇAL (Petit -> Gran) */}
                <button 
                    className={`sort-option-btn ${sortOrder?.field === 'capcal' && sortOrder?.direction === 'asc' ? 'actiu' : ''}`}
                    onClick={() => handleSelectSort('capcal', 'asc')}
                >
                    <IconCrown style={{ width: '25px', height: '25px', color: 'currentColor' }} />
                    <span>Capçal petit a gran</span>
                </button>

             </div>
          </>
      )}



      {/* AQUEST DIVIDER - Amb estil dinàmic pel padding */}
      {/* Si Filters obert -> Padding Left 50% */}
      {/* Si Sort obert -> Padding Right 50% */}
      <div style={{ 
          paddingLeft: showFilters ? '50%' : '0', 
          paddingRight: showSort ? '50%' : '0',
          transition: 'all 0.3s ease' 
      }}>
        <Divider />
      </div>
      {/* AQUEST DIVIDER */}


{/* AQUI VAN ELS FILTRES (Estan posats a dalt condicionalment) */}


      {/* RESULTATS */}

      {/* Fem servir processedPosts (filtrats i ordenats) */}

      {processedPosts.length > 0 ? (

          processedPosts.map((arbre) => (

            <React.Fragment key={arbre.id}>

              <TreeCard
                id={arbre.id}
                name={arbre.nom}
                titleColor="blau"
                municipality={arbre.municipi}
                comarca={arbre.comarques?.comarca} 
                height={arbre.alcada}
                trunkWidth={arbre.gruix}
                crownWidth={arbre.capcal}
              />

              <Divider />

            </React.Fragment>

          ))

      ) : (

          /* Missatge si no trobem res */

          <div className="no-results">

              <p>No s'ha trobat resultats</p>

          </div>

      )}

      
      <Space />

    </div>

  );
  
}

export default Search;