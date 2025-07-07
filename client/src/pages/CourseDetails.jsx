import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
//   const [error, setError] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
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
  }, [courseId, navigate]);

  if (!course) return <div>Loading course details...</div>;

  // course details
  return (
    <div className="course-details">
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>{course.title}</h2>
      <img
        src={course.image || "https://via.placeholder.com/300x160?text=Course+Image"}
        alt={course.title}
        className="course-details-img"
      />
      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Price:</strong> ₹{course.price || 0}</p>
    </div>
  );
}

export default CourseDetails;
