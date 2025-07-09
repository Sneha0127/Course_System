import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseDetails.css";

function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

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

    fetchCourseDetails();
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
      // Optional: redirect or update state
    } catch (error) {
      console.error("Enrollment failed:", error.response?.data || error.message);
      alert("Failed to enroll.");
    }
  };

  if (!course) return <div>Loading course details...</div>;

  return (
    <div className="course-details" style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>{course.title}</h2>
      <img
        src={course.image || "https://via.placeholder.com/300x160?text=Course+Image"}
        alt={course.title}
        style={{ width: "300px", height: "160px", objectFit: "cover", borderRadius: "8px" }}
      />
      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Price:</strong> ₹{course.price || 0}</p>
      <button className="btnn" onClick={() => handleEnroll(course._id)}>Enroll Now</button>
    </div>
  );
}

export default CourseDetails;
