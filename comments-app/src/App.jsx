import React from "react";
import {
  BrowserRouter,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Movies from "./components/Movies";
import WelcomePage from "./welcomepage/WelcomePage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/movies/:id" element={<Movies />} />
          <Route path="/movies" element={<WelcomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// <Route path="/Reviews" element={<Reviews />} />
// <Route path="/Comments" element={<Comments />} /> */}
//import Reviews from './components/Reviews';
//import Comments from './components/Comments';
