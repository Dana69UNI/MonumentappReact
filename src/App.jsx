import { useState } from 'react'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';

import Home from './pages/Home'
import Search from './pages/Search'
import New from './pages/New'
import Biblioteca from './pages/Biblioteca';
import Perfil from './pages/Perfil'

// import './App.css'


// function App() {
  

//   return (
//     <> 
//      <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/search" element={<Search />} />
//               <Route path="/arbre/:id" element={<ArbreDetail />} />
//       </Routes>
   
//     <Footer />
     
//     </>
//   )
// }

function App() {
  return (
    <BrowserRouter>
      {/* El contingut principal canvia segons la ruta */}
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cercar" element={<Search />} />
          <Route path="/nou" element={<New />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </div>

      {/* El Footer està fora de Routes, per tant SEMPRE es veu */}
      <Footer />
    </BrowserRouter>
  );
}

export default App
