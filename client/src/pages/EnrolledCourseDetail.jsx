import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EnrolledCourseDetail.css"; 

function EnrolledCourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [completion, setCompletion] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/courses/my-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const matched = res.data.find(c => c._id === courseId);
        if (matched) {
          setCourse(matched);
          const randomCompletion = Math.floor(Math.random() * 101); // Random 0-100
          setCompletion(randomCompletion);
        } else {
          navigate("/student");
        }
      } catch (err) {
        console.error(err);
        navigate("/student");
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  if (!course) return <p>Loading...</p>;

  return (
    <div className="wrappp">
    <div className="enrolled-detail">
      <h1>{course.title}</h1>
      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Enrollment Date:</strong> {new Date(course.enrollmentDate).toLocaleDateString()}</p>
      <p><strong>Completion Level:</strong> {completion}%</p>
        <div className="progress-container">
        <div className="progress-bar" style={{ width: `${completion}%` }}>
          {completion}%
        </div>
      </div>
      <button onClick={() => navigate("/student")}>Back to Dashboard</button>
    </div>
    </div>
  );
}

export default EnrolledCourseDetail;
