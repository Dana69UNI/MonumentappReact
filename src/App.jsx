import { useState } from 'react'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';

import Home from './pages/Home'
import Search from './pages/Search'
import New from './pages/New'
import Biblioteca from './pages/Biblioteca';
import Perfil from './pages/Perfil'

// Com a prova pàgina de TEST
import Test from './pages/Test';
import ArbreDetail from './pages/ArbreDetail';
import { VisitedProvider } from "./context/contextVisitats";
import { PendentsProvider } from './context/contextPendents';

function App() {
  return (
    <BrowserRouter>
        <VisitedProvider>
          <PendentsProvider>
      {/* El contingut principal canvia segons la ruta */}
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cercar" element={<Search />} />
          <Route path="/nou" element={<New />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/arbre/:id" element={<ArbreDetail />} />
          {/* Per acabar de fer */}
          {/* <Route path="/biblioteca/:id" ... /> */}

          {/* Ruta de prova per a la pàgina Test */}
          <Route path="/test" element={<Test />} />
        </Routes>
      </div>

      {/* El Footer està fora de Routes, per tant SEMPRE es veu */}
      <Footer />
        </PendentsProvider>
      </VisitedProvider>
    </BrowserRouter>
  );
}

export default App
