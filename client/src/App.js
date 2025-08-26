import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import ManageCourses from "./pages/ManageCourses";
import StudentEnrolled from "./pages/StudentEnrolled";

import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import CourseDetails from "./pages/CourseDetails";
import EnrolledCourseDetail from "./pages/EnrolledCourseDetail";
import AddModules from "./pages/AddModules";

import ProtectedRoute from "./components/ProtectedRoute";
import ViewModules from "./pages/ViewModules";
import ViewModule from "./pages/ViewModule";
import StudentViewModules from "./pages/StudentViewModules";
import StudentViewModule from "./pages/StudentViewModule";
import StudentsProgress from "./pages/StudentsProgress";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
       <Route path="/view-modules/:courseId" element={<ViewModules />} />
       
        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manage-courses" element={<ManageCourses />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/studentEnrolled" element={<StudentEnrolled />} />
          {/* <Route path="/admin/add-modules/:courseId" element={<AddModules/>}/> */}
         <Route path="/add-modules/:courseId" element={<AddModules />} />
         <Route path="/view-module/:courseId/:moduleId" element={<ViewModule/>} />
         <Route path='/admin/course/:courseId/students' element={<StudentsProgress/>}/>
        </Route>

        {/* Student Protected Routes */}
        <Route element={<ProtectedRoute allowedRole="student" />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/enrolled/:courseId" element={<EnrolledCourseDetail />} />
        <Route path="/student/course/:courseId/modules" element={<StudentViewModules />} />
       <Route path="/student/course/:courseId/module/:moduleId" element={<StudentViewModule />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
