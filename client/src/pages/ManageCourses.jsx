import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ManageCourses.css";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/courses/admin/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const handleViewStudents = async (id, name) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
      setSelectedCourseName(name);
      setSelectedCourseId(id);
    } catch (err) {
      console.error("Error fetching students:", err.message);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!selectedCourseId) return;

    if (!window.confirm("Remove this student from the course?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/courses/admin/course/${selectedCourseId}/student/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleViewStudents(selectedCourseId, selectedCourseName);
    } catch (err) {
      console.error("Error removing student:", err.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="m-container">
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>Manage Courses</h2>
      <ul className="course-list">
        {courses.map((course) => (
          <li key={course._id} className="course-item">
            <strong>{course.title}</strong>: {course.description}
            <br />
            <button onClick={() => handleDelete(course._id)}>Delete</button>
            <button onClick={() => handleViewStudents(course._id, course.title)}>View Students</button>
            <button onClick={() => navigate(`/admin?edit=${course._id}`)}>Edit</button>
          </li>
        ))}
      </ul>

      {students.length > 0 && (
        <div className="students-section">
          <h3>Students Enrolled in {selectedCourseName}</h3>
          <ul>
            {students.map((student) => (
              <li key={student._id}>
                {student.name} ({student.email}){" "}
                <button onClick={() => handleRemoveStudent(student._id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ManageCourses;
