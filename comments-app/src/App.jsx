import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Movies from './components/Movies';
import MovieDetails from './components/MovieDetails.jsx';
import Reviews from './components/Reviews';
import Comments from './components/Comments';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/Movies/:id" element={<MovieDetails />} />
          <Route path="/Reviews" element={<Reviews />} />
          <Route path="/Comments" element={<Comments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
