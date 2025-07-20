import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import CourseDetails from "./pages/CourseDetails";
import ManageCourses from "./pages/ManageCourses";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentProfile from "./pages/StudentProfile";
import AdminProfile from "./pages/AdminProfile";
import EnrolledCourseDetail from "./pages/EnrolledCourseDetail";
import StudentEnrolled from "./pages/StudentEnrolled";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manage-courses" element={<ManageCourses />} />
        </Route>

       
        <Route element={<ProtectedRoute allowedRole="student" />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
        </Route>
        {/* <Route path="/studentprofile" element={<StudentProfile/>}/> */}
        <Route element={<ProtectedRoute allowedRole="student" />}>
  <Route path="/student" element={<StudentDashboard />} />
  <Route path="/student/profile" element={<StudentProfile />} />
  <Route path="/enrolled/:courseId" element={<EnrolledCourseDetail />} />
</Route>

<Route element={<ProtectedRoute allowedRole="admin" />}>
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/profile" element={<AdminProfile />} />
  <Route path="/studentEnrolled" element={<StudentEnrolled />} />
</Route>

      </Routes>
    </Router>
  );
}

export default App;
