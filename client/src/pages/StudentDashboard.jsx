import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css"; 

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [showEnrolled, setShowEnrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const allCoursesRes = await axios.get("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(allCoursesRes.data);

        const enrolledRes = await axios.get("http://localhost:5000/api/courses/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrolled(enrolledRes.data);
      } catch (error) {
        console.error("Error loading courses:", error.response?.data || error.message);
      }
    };

    fetchCourses();
  }, []);

  //   const toggleReadMore = (courseId) => {
  //  setReadmore((p) => (p=== courseId ? null : courseId));
  //  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/courses/enroll/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Enrolled successfully!");

      const enrolledRes = await axios.get("http://localhost:5000/api/courses/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrolled(enrolledRes.data);
    } catch (error) {
      console.error("Enrollment failed:", error.response?.data || error.message);
      alert("Failed to enroll.");
    }
  };

  return (
    <div className="d-container">
      <div className="d-header">
        <h2>STUDENT DASHBOARD</h2>
        <div className="header-btns">
          <button onClick={() => setShowEnrolled(!showEnrolled)}>
            {showEnrolled ? "Hide Enrolled Courses" : "View Enrolled Courses"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {showEnrolled && (
        <div>
          <h3>Your Enrolled Courses</h3>
          <ul className="enrolled-list">
            {enrolled.map((course) => (
              <li key={course._id}>{course.title}</li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="hhh">Courses</h3>
      <div className="course-grid">
        {courses.map((course) => (
          <div className="course-card" key={course._id}>
            <img
              src={course.image || "https://via.placeholder.com/200x120?text=Course+Image"}
              alt={course.title}
            />
            <h4>{course.title}</h4>
           <p>
            {course.description.slice(0, 100) + "..."}
         
         <button onClick={() => navigate(`/course/${course._id}`)}>View</button>
          </p>

            <p><strong>Price:</strong> ₹{course.price || 0}</p>
            <button className="btnn" onClick={() => handleEnroll(course._id)}>Enroll Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;
