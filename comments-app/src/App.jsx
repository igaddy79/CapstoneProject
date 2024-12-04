import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Movies from './components/Movies';

//import Reviews from './components/Reviews';
//import Comments from './components/Comments';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/movies/:id" element={<Movies />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// <Route path="/Reviews" element={<Reviews />} />
// <Route path="/Comments" element={<Comments />} /> */}