import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentEnrolled.css";
const DEFAULT_IMAGE = 'data:image/jpeg;base64,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'; // You should place this image in public folder

function StudentEnrolled() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.student) {
    return <p>No student data provided.</p>;
  }

  const { student, courseId, courseName } = state;
  const token = localStorage.getItem("token");

  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to remove this student from the course?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/courses/admin/course/${courseId}/student/${student._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Student removed from the course");
      navigate("/admin/manage-courses"); // Go back after removal
    } catch (err) {
      console.error("Error removing student:", err.message);
    }
  };

  const randomCompletion = Math.floor(Math.random() * 101); // Simulated completion

  return (
    <div className="wrap">
 <button className="btnn1" onClick={()=>{navigate("/admin/manage-courses")} }>Back</button>
  <div className="student-container">
    <h2>Student Detail - {courseName}</h2>
    <img
      src={student.profilePicture ?
        `http://localhost:5000${student.profilePicture}`
      :DEFAULT_IMAGE}
      alt="Profile"
      />
    <p><strong>Name:</strong> {student.name}</p>
    <p><strong>Email:</strong> {student.email}</p>
    <p><strong>Enrollment Date:</strong> {new Date(student.enrollmentDate || Date.now()).toLocaleDateString()}</p>

    <div className="progress-bar-wrapper">
      <div
        className="progress-bar-fill"
        style={{ width: `${randomCompletion}%` }}
        >
        Completion: {randomCompletion}%
      </div>
    </div>

    <button onClick={handleRemove} className="remove-btn">
      Remove from Course
    </button>
  </div>
</div>
);

}

export default StudentEnrolled;
