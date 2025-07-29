import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // 💡 Import the CSS here

function HomePage() {
  return (
   <div
    className="text-center min-h-screen pt-[150px] bg-no-repeat bg-cover font-sans"
    style={{
      backgroundImage: 'url("https://excelr.in/data_analyst_course_bangalore/assets/images/DA_Banner.jpg")',
      backgroundSize: '100% 900px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    }}
  >
      <h1 className="text-4xl font-bold text-white  mb-6">@Courses.inn</h1>
      <p className="text-3xl text-blue-300 mb-10">Please login or sign up to continue</p>

     <div className="mt-7">
  <Link to="/login">
    <button className="px-6 py-3 text-lg m-2 rounded-md bg-blue-500 text-white hover:bg-white hover:text-blue-500 transition duration-300">
      Login
    </button>
  </Link>

  <Link to="/signup">
    <button className="px-6 py-3 text-lg m-2 rounded-md bg-blue-500 text-white hover:bg-white hover:text-blue-500 transition duration-300">
      Sign Up
    </button>
  </Link>
</div>
    </div>
  );
}

export default HomePage;
