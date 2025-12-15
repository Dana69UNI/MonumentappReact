import { useState } from 'react'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';

import Home from './pages/Home'
import Search from './pages/Search'
import New from './pages/New'
import Biblioteca from './pages/Biblioteca';
import Perfil from './pages/Perfil'
import ArbreDetall from './pages/ArbreDetail';

//comentari per borrar
//jaja ara he vist que el tenia i m'ha fet gràcia jjaja t'hi quedes xatoo

function App() {
  return (
    <BrowserRouter>
      {/* El contingut principal canvia segons la ruta */}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cercar" element={<Search />} />
          <Route path="/nou" element={<New />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/cercar/:id" element={<ArbreDetall />} />
        </Routes>
      </div>

      {/* El Footer està fora de Routes, per tant SEMPRE es veu */}
      <Footer />
    </BrowserRouter>
  );
}

export default App
