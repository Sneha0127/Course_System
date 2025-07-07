import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import CourseDetails from "./pages/CourseDetails";
// import AdminSignupPage from "./pages/AdminSignupPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/admin-signup" element={ <AdminSignupPage/>} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
