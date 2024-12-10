import React, { useState } from "react";
import { addNewUser } from "../api-logic";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation checks
    if (!username || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    // Handle signup logic here
    const newUser = {
      username: username,
      password: password,
      is_admin: false,
    };
    addNewUser(newUser);

    console.log("Signing up with:", { username, password });
    navigate("/");
  };

  return (
    <div className="container">
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <br />
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <br />
          <br />

          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <br />
          <br />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <br />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
          <br />
          <br />

          <input type="submit" value="Sign Up" />
        </form>
        {errorMessage && <div className="error">{errorMessage}</div>}
      </div>
    </div>
  );
}

export default Signup;
