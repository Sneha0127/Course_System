import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
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
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center font-sans"
      style={{
        backgroundImage:
          'linear-gradient(rgba(12,20,33,0.8), rgba(35,49,70,0.8)), url("https://focus.namirial.com/en/wp-content/uploads/sites/4/2023/09/AI-machine-learning.jpeg")',
      }}
    >
      <form
        className="bg-white/95 p-10 rounded-xl shadow-xl text-center w-[400px] h-[360px] hover:shadow-2xl hover:scale-105 transition-transform duration-300"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2 className="text-2xl font-medium text-gray-800 mb-5">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-700 p-2 mb-4 rounded text-sm animate-fade-in">
            {error}
          </div>
        )}

        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-3 border border-gray-300 rounded-md text-base hover:shadow-md outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full p-3 mb-3 border border-gray-300 rounded-md text-base hover:shadow-md outline-none"
        />

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-md text-base hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
