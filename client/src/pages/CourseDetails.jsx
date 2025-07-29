import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseDetails.css";

function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch course details
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data);
      } catch (err) {
        console.error("Error loading course:", err);
      }
    };

    // Fetch enrolled courses
    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/my-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      }
    };

    fetchCourseDetails();
    fetchEnrolledCourses();
  }, [courseId, navigate, token]);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/courses/enroll/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Enrolled successfully!");
      const res = await axios.get(`http://localhost:5000/api/courses/my-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrolledCourses(res.data);
    } catch (error) {
      console.error("Enrollment failed:", error.response?.data || error.message);
      alert("Failed to enroll.");
    }
  };

  // const isEnrolled = enrolledCourses.some((enrolled) => enrolled._id === courseId);

  if (!course) return <div>Loading course details...</div>;

  return (
    <div className="course-details" style={{ padding: "20px" }}>
      <button onClick={() => navigate(`/student`)}>← Back</button>
      <h2>{course.title}</h2>
      <img
        src={course.image || "https://via.placeholder.com/300x160?text=Course+Image"}
        alt={course.title}
      />
      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Price:</strong> ₹{course.price || 0}</p>

      {enrolledCourses.some((en) => en._id === courseId)? (
      <>
          <button className="btnn-2" disabled>
            Enrolled
          </button>
          <button
            className="btnn-2"
            onClick={() => navigate(`/enrolled/${courseId}`)}
            style={{ marginLeft: "10px" }}
          >
            View Completion Level
          </button>
        </>
      ) : (
        <button className="btnn" onClick={() => handleEnroll(course._id)}>
          Enroll Now
        </button>
      )}
    </div>
  );
}

export default CourseDetails;
