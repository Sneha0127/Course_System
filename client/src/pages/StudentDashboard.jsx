import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [showEnrolled, setShowEnrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
      localStorage.clear();
      navigate("/login", { replace: true });
      return;
    }

    // Fetch courses only if logged in and role is student
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
  }, [navigate]);

 const handleEnroll = async (courseId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `http://localhost:5000/api/courses/enroll/${courseId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert(response.data.message || "Enrolled successfully!");

    const enrolledRes = await axios.get("http://localhost:5000/api/courses/my-courses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEnrolled(enrolledRes.data);

  } catch (error) {
    console.error("Enrollment failed:", error.response?.data || error.message);

    const message =
      error.response?.data?.message || "Enrollment failed due to server error";

    alert("Failed to enroll: " + message);
  }
};

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="d-container">
      <div className="d-header">
        <h1 className="mainn" onClick={() => navigate("/main")}>@Courses.inn</h1>
        <h2>Explore..</h2>
        <div className="header-btns">
          <button onClick={() => setShowEnrolled(!showEnrolled)}>
            {showEnrolled ? "Hide Enrolled Courses" : "View Enrolled Courses"}
          </button>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => navigate('/student/profile')}>Profile</button>
        </div>
      </div>

      <SearchBar/>

      {showEnrolled && (
        <div>
          <h3 className="h-view">Your Enrolled Courses</h3>
         <ul className="enrolled-list">
          {enrolled.map((course) => (
            <li key={course._id} onClick={() => navigate(`/enrolled/${course._id}`)} style={{ cursor: "pointer" }}>
              {course.title}
            </li>
          ))}
        </ul>
        </div>
      )}

      <h3 className="hhh">Courses</h3>
      <div className="course-grid">
        {filteredCourses.map((course) => (
        <div className="course-card" key={course._id}>
      <img
        src={course.image || "https://via.placeholder.com/200x120?text=Course+Image"}
        alt={course.title}
      />
      <h4>{course.title}</h4>
      <p>
        {course.description.slice(0, 100) + "..."}
        <button className="btn-1" onClick={() => navigate(`/course/${course._id}`)}>
          View
        </button>
      </p>
      <p><strong>Price:</strong> ₹{course.price || 0}</p>

  {enrolled.some((en) => en._id === course._id) ? (
    <button className="btnn-2" disabled>
      Enrolled
    </button>
  ) : (
    <button className="btnn" onClick={() => handleEnroll(course._id)}>
      Enroll Now
    </button>
  )}
</div>

        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;
