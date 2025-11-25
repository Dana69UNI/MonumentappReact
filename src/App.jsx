import { useState } from 'react'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Search from './pages/Search'
import Footer from './components/Footer'
import './App.css'


function App() {
  

  return (
    <> 
     <Routes>
        <Route path="/pages/HomePage" element={<HomePage />} />
        <Route path="/pages/Search" element={<Search />} />
      </Routes>
   
    <Footer />
     
    </>
  )
}

export default App
