import { useState } from "react";
import { login } from "../api-logic";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("Both fields are required");
    } else {
      setErrorMessage("");
      // Handle login logic here (e.g., API call)
      const user = {
        username: username,
        password: password,
      };
      const token = await login(user);
      //storing authentication token in local storage
      window.localStorage.setItem("token", token);
      console.log("Logging in:", { username, password });
    }
  };

  return (
    <div>
      <div>
        <h2>Login</h2>
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

          <input type="submit" value="Login" />
        </form>
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Login;
