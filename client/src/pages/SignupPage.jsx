import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function SignupPage() {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError("SignUp Failed. You already have an account!!");
      setTimeout(() => setError(""), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-800 to-blue-500 font-sans">
      <form
        className="bg-white p-10 rounded-lg shadow-lg w-80 text-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Sign Up</h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-700 px-4 py-2 mb-4 rounded-md text-sm animate-fade-in">
            {error}
          </div>
        )}

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="w-full p-3 mb-3 border border-gray-300 rounded-md text-base"
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 mb-3 border border-gray-300 rounded-md text-base hover:shadow-lg"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-3 border border-gray-300 rounded-md text-base hover:shadow-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md text-base hover:shadow-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition-all"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
