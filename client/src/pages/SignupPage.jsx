import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./SignupPage.css"; // CSS for styling

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
      await axios.post("http://localhost:5000/api/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      navigate("/login");
    } catch (err) {
      setError("SignUp Failed. You already have an account!!");
      setTimeout(() => setError(""), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="scontainer">
      <form
        className="sbox"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <h2>Sign Up</h2>

        {error && <div className="e-pop">{error}</div>}

        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
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

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
