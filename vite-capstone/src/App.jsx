import './App.css'
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Movies from './components/Movies.jsx';
import Navigations from './components/Navigations.jsx';

export default function App() {

  return (
    <div>
      <Navigations />
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </div>
  );
}
