import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Clear token and role when login page loads
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.go(1); // disable back navigation from login
    };
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "student") {
        navigate("/student");
      } else {
        setError("Unauthorized role.");
      }
    } catch (err) {
      setError("Login failed. Invalid credentials.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="lcontainer">
      <form
        className="lbox"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2>Login</h2>

        {error && <div className="error-popup">{error}</div>}

        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
