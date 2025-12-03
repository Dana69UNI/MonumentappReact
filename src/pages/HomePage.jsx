import { useState, useEffect } from 'react';
import Header from '../components/header';
import './HomePage.css';
import { Link } from 'react-router-dom';

// ========== APIs ==========
const API_RECOMENATS = "https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbres_recomenats?recomenacio_estat=eq.true&select=id,descripcio,arbre_id,arbres(nom,alcada,gruix,capcal)&order=id.asc";
const API_RECOMENATS_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q";

const API_REPTE = "https://ndhaolftrgywuzadusxe.supabase.co/rest/v1/arbre_repte_mensual?mes=eq.2025-12-01&select=id,descripcio,arbre_id,arbres(nom,municipi,alcada,gruix,capcal,comarques(comarca))";
const API_REPTE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kaGFvbGZ0cmd5d3V6YWR1c3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDg4ODQsImV4cCI6MjA3ODAyNDg4NH0.OVnvm5i10aYbnBdYph9EO2x6-k9Ah_Bro8UF4QfAH7Q";

const API_ULTIM = "URL_ULTIM";
const API_ULTIM_KEY = "API_KEY_ULTIM";


function HomePage() {

  // ⭐ carrusel (igual que antes)
  const [items, setItems] = useState([]);

  // ⭐ lista de arbres recomenats
  const [posts, setPosts] = useState([]);

  const [repte, setRepte] = useState(null);
  const [ultim, setUltim] = useState(null);

  const [loading, setLoading] = useState(true);


  const fetchAPI = async (url, key) => {
    try {
      const res = await fetch(url, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`
        }
      });
      return await res.json();
    } catch (e) {
      console.error("Error:", e);
      return null;
    }
  };


  useEffect(() => {

    const load = async () => {

      // 1) Cargar recomenats
      const recom = await fetchAPI(API_RECOMENATS, API_RECOMENATS_KEY);
      if (recom) setPosts(recom);

      // Preparar carrusel con los mismos datos
      if (recom) {
        const carouselData = recom.map((item) => ({
          id: item.id,
          text: item.arbres?.nom,          // texto del carrusel
          img: item.arbres?.capcal || "#", 
        }));
        setItems(carouselData);
      }

      // 2) Repte del mes
      const repteRes = await fetchAPI(API_REPTE, API_REPTE_KEY);
      if (repteRes) setRepte(repteRes[0]);

      // 3) Últim arbre
      const ultimRes = await fetchAPI(API_ULTIM, API_ULTIM_KEY);
      if (ultimRes) setUltim(ultimRes[0]);

      setLoading(false);
    };

    load();
  }, []);


  if (loading) return <p>Carregant...</p>;


  return (
    <>
      <Header />

      {/* =========================
          CARRUSEL (igual que TU CÓDIGO)
      ========================== */}
      <div>
        <h3 className='TituloArbresRecomentas'>Arbres recomenats</h3>

        <div className="carousel-scroll">
          {items.map((item) => {
            // Buscar el arbre_id correspondiente en posts
            const arbre = posts.find(p => p.arbres?.nom === item.text);
            return (
              <Link
                key={item.id}
                to={`/arbre/${arbre?.arbre_id}`}
                className="card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img src={item.img} alt={item.text} />
                <p>{item.text}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* =========================
          LISTA DE ARBRES
      ========================== */}
      <div className='arbresRecomenats'>
        {posts.map((post) => (
          <Link
            to={`/arbre/${post.arbre_id}`}
            key={post.id}
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <article className='arbresArticles'>
              <h3>{post.arbres?.nom}</h3>
              <p>{post.descripcio}</p>
              <ul>
                <li>Alçada: {post.arbres?.alcada}m</li>
                <li>Gruix: {post.arbres?.gruix}m</li>
                <li>Capçal: {post.arbres?.capcal}m</li>
              </ul>
            </article>
          </Link>
        ))}
      </div>

      {/* =========================
          REPTE DEL MES
      ========================== */}
      <section className="Grup_RepteDelMes">
        <h3 className="Titol_Repte">Repte del mes</h3>

        {repte && (
          <div className="Info_Repte">
            <img src={repte.imatge} className="Imatge_Repte" />
            <div className="Dades_Repte">
              <h4>{repte.nom}</h4>
              <p>{repte.localitzacio}</p>
              <ul>
                <li>Alçada: {repte.alcada}m</li>
                <li>Gruix: {repte.gruix}m</li>
                <li>Capçal: {repte.capcal}m</li>
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* =========================
          DIARI (sin API)
      ========================== */}
      <section className="Grup_Diari">
        <h3 className="Titol_Diari">Diari</h3>

        <div className="PuntsDiari">
          {[...Array(120)].map((_, i) => (
            <span className="punt" key={i}></span>
          ))}
        </div>
      </section>

      {/* =========================
          ÚLTIM ARBRE VISITAT
      ========================== */}
      <section className="Grup_UltimArbreVisitat">
        <h3 className="Titol_UltimArbre">Últim arbre visitat</h3>

        {ultim && (
          <>
            <p className="Data_Ultim">{ultim.data_visita}</p>
            <p className="Descripcio_Ultim">{ultim.descripcio}</p>

            <div className="Info_Ultim">
              <img src={ultim.imatge} className="Imatge_Ultim" />
              <div className="Detalls_Ultim">
                <h3>{ultim.nom}</h3>
                <p>{ultim.localitzacio}</p>
                <ul>
                  <li>Alçada: {ultim.alcada}m</li>
                  <li>Gruix: {ultim.gruix}m</li>
                  <li>Capçal: {ultim.capcal}m</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </section>

    </>
  );
}

export default HomePage;
