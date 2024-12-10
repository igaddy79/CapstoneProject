import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Movies from "./components/Movies";
import Login from "./login-signup/Login";
import SignUp from "./login-signup/SignUp";
import WelcomePage from "./welcomepage/WelcomePage";
import Navigations from "./components/Navigations/Navigations";


function App() {
  return (
    <Router>
      <div className="App">
        <Navigations />
        <Routes>
          <Route path="/movies/:id" element={<Movies />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<WelcomePage />} />
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
