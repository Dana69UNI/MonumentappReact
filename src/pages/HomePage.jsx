import { useState, useEffect } from 'react';
import Header from '../components/header';
import './HomePage.css';
import { Link } from 'react-router-dom';


// =============================
//   TUS APIs
// =============================
const API_RECOMENATS = "URL_RECOMENATS";
const API_RECOMENATS_KEY = "API_KEY_RECOMENATS";

const API_REPTE = "URL_REPTE";
const API_REPTE_KEY = "API_KEY_REPTE";

const API_ULTIM = "URL_ULTIM";
const API_ULTIM_KEY = "API_KEY_ULTIM";


function HomePage() {

  const [posts, setPosts] = useState([]);
  const [repte, setRepte] = useState(null);
  const [ultim, setUltim] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);


  // 🔥 TU FETCH ORIGINAL — SIN CAMBIAR
  const fetchAPI = async (url, key) => {
    try {
      const res = await fetch(url, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`
        }
      });

      if (!res.ok) {
        console.error("Error API:", url, await res.text());
        return null;
      }

      return await res.json();

    } catch (err) {
      console.error("Fallo fetch:", err);
      return null;
    }
  };


  useEffect(() => {
    const load = async () => {
      try {
        // 🔥 1) Árboles recomendados (lista + carrusel)
        const recom = await fetchAPI(API_RECOMENATS, API_RECOMENATS_KEY);
        if (recom) setPosts(recom);

        // 🔥 2) Repte del mes
        const repteM = await fetchAPI(API_REPTE, API_REPTE_KEY);
        if (repteM) setRepte(repteM[0]);

        // 🔥 3) Últim arbre visitat
        const ultimA = await fetchAPI(API_ULTIM, API_ULTIM_KEY);
        if (ultimA) setUltim(ultimA[0]);

      } catch {
        setErrorMsg("No s'han pogut carregar les dades.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);


  if (loading) return <p>Carregant...</p>;
  if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;


  return (
    <>
      <Header />

      {/* =========================
          ARBRES RECOMENATS
      ========================== */}
      <div>
        <h3 className='TituloArbresRecomentas'>Arbres recomenats</h3>

        {/* ⭐ CARRUSEL: usa la MISMA API DE posts */}
        <div className="carousel-scroll">
          {posts.map((item) => (
            <div className="card" key={item.id}>

              {/* Cambia item.arbres.capcal por el CAMPO QUE QUIERAS PARA IMAGEN */}
              <img src={item.arbres?.capcal} alt={item.arbres?.nom} />

              {/* TÍTULO DEL CARRUSEL */}
              <p>{item.arbres?.nom}</p>

            </div>
          ))}
        </div>
      </div>


      {/* ⭐ LISTA ÁRBOLES RECOMENDADOS */}
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
          DIARI (SIN API)
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
