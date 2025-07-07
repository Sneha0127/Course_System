import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // 💡 Import the CSS here

function HomePage() {
  return (
    <div className="container">
      <h1 className="ttitle">@Courses.inn</h1>
      <p className="subtitle">Please login or sign up to continue</p>

      <div className="buttons">
        <Link to="/login">
          <button className="btn">Login</button>
        </Link>

        <Link to="/signup">
          <button className="btn">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
