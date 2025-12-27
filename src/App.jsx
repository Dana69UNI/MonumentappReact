import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient'; // IMPORT IMPORTANT: La connexió amb Supabase

// Components
import Footer from './components/Footer'; 

// Pàgines
import Home from './pages/Home'
import Search from './pages/Search'
import New from './pages/New' 
import Biblioteca from './pages/Biblioteca';
import Perfil from './pages/Perfil'
import ArbreDetall from './pages/ArbreDetail';
import Login from './pages/Login'; // IMPORT IMPORTANT: La nova pàgina de Login

//comentari per borrar
//jaja ara he vist que el tenia i m'ha fet gràcia jjaja t'hi quedes xatoo (Jo també el deixo, no toco res! 😄)

function App() {
  // --- ESTATS DE SESSIÓ ---
  const [session, setSession] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Comprovem si hi ha sessió guardada al carregar l'app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Escoltem canvis en temps real (per si l'usuari fa login o logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);


  // --- LÒGICA DE PANTALLES ---

  // 1. Mentre carrega, no mostrem res (o podries posar un spinner)
  if (loading) return null; 

  // 2. SI NO ESTÀ LOGUEJAT I NO HA DIT QUE ÉS INVITAT -> Mostrem LOGIN
  // (Això "segresta" l'app i no deixa veure res més fins que decideixi)
  if (!session && !isGuest) {
    return <Login onEntrarComaInvitat={() => setIsGuest(true)} />;
  }

  // 3. SI JA TENIM SESSIÓ O ÉS INVITAT -> Mostrem la teva App normal
  return (
    <BrowserRouter>
      {/* El contingut principal canvia segons la ruta */}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cercar" element={<Search />} />
          <Route path="/nou" element={<New />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          
          {/* IMPORTANT: Passem la 'session' al Perfil perquè sàpiga qui és l'usuari */}
          <Route path="/perfil" element={<Perfil session={session} />} />
          
          <Route path="/cercar/:id" element={<ArbreDetall />} />
        </Routes>
      </div>

      {/* El Footer està fora de Routes, per tant SEMPRE es veu */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;