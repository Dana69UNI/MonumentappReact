import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Components
import Footer from './components/Footer'; 

// Pàgines
import Home from './pages/Home'
import Search from './pages/Search'
import New from './pages/New' 
import Biblioteca from './pages/Biblioteca';
import Perfil from './pages/Perfil'
import ArbreDetall from './pages/ArbreDetail';
import Login from './pages/Login'; 
import Register from './pages/Register'; // NOU IMPORT

function App() {
  const [session, setSession] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // NOU ESTAT: Controla quina pantalla d'autenticació veiem ('login' o 'register')
  const [authView, setAuthView] = useState('login'); 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);


  if (loading) return null; 

  // --- BLOC NO AUTENTICAT ---
  if (!session && !isGuest) {
      // Si la vista és 'register', mostrem el component de Registre
      if (authView === 'register') {
          return (
            <Register 
                onGoToLogin={() => setAuthView('login')} 
                onRegisterSuccess={() => setAuthView('login')} // En acabar, tornem al login (o podríem forçar home si l'auth fos auto)
            />
          );
      }
      
      // Si no, mostrem Login
      return (
        <Login 
            onEntrarComaInvitat={() => setIsGuest(true)} 
            onGoToRegister={() => setAuthView('register')}
        />
      );
  }

  // --- BLOC APP PRINCIPAL ---
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cercar" element={<Search />} />
          <Route path="/nou" element={<New />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/perfil" element={<Perfil session={session} />} />
          <Route path="/cercar/:id" element={<ArbreDetall />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;