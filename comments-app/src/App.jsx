import React from "react";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Movies from "./components/Movies";
import Login from "./login-signup/Login";
import SignUp from "./login-signup/SignUp";
import WelcomePage from "./welcomepage/WelcomePage";
import AdminPage from "./adminpage/AdminPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/movies/:id" element={<Movies />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<WelcomePage />} />
          <Route path="/movies" element={<WelcomePage />} />
          <Route path="/admin" element={<AdminPage />} />
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
