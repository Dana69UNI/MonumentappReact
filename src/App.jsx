import { useState } from 'react'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Search from './pages/Search'
import Footer from './components/Footer'
import ArbreDetail from './pages/ArbreDetail'
import './App.css'


function App() {
  

  return (
    <> 
     <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<Search />} />
              <Route path="/arbre/:id" element={<ArbreDetail />} />
      </Routes>
   
    <Footer />
     
    </>
  )
}

export default App
