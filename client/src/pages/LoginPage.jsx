// LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      role === "admin" ? navigate("/admin") : navigate("/student");
    } catch (err) {
      setError("Login failed. Please check your credentials."); 
      setTimeout(() => setError(""), 4000); 
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

        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

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
