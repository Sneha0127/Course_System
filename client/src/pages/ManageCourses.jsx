import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import "./ManageCourses.css";

const DEFAULT_IMAGE = 'data:image/jpeg;base64,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'; // You should place this image in public folder

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
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

  const handleCourseSelect = (courseId) => {
  const course = courses.find(c => c._id === courseId);
  if (course) {
    setSelectedCourse(course);
    setStudents([]); // Clear student view if needed
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

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="m-container">
      <SearchBar onCourseSelect={handleCourseSelect} />
      <button onClick={() => navigate("/admin")}>← Back</button>
      <h2>Manage Courses</h2>
     <ul className="course-list">
        {(selectedCourse ? [selectedCourse] : courses).map((course) => (
          <li key={course._id} className="course-item">
            <strong>{course.title}</strong>: {course.description}
            <br />
            <button onClick={() => handleDelete(course._id)}>Delete</button>
            <button onClick={() => handleViewStudents(course._id, course.title)}>View Students</button>
            <button onClick={() => navigate(`/admin?edit=${course._id}`)}>Edit</button>
          </li>
        ))}
      </ul>

      {selectedCourse && (
        <button onClick={() => setSelectedCourse(null)}>Show All Courses</button>
      )}

      {students.length > 0 && (
        <div className="students-section">
          <h3>Students Enrolled in {selectedCourseName}</h3>
          <ul>
           {students.map((student) => (
      <li key={student._id} className="student-item" >
       <img
        src= {student.profilePicture
      ? `http://localhost:5000${student.profilePicture}`
      : DEFAULT_IMAGE}
        // {`http://localhost:5000${student.profilePicture}`}
        alt="Profile"
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        
      />
        <div className="ss">
          <strong>{student.name}</strong> ({student.email})
          {/* <div>Enrolled on: {new Date(student.enrollmentDate).toLocaleDateString()}</div> */}
        </div>
    <button
  onClick={() =>
    navigate("/studentEnrolled", {
      state: {
        student,
        courseId: selectedCourseId,
        courseName: selectedCourseName,
      }, }) }
>
  View
</button>

        {/* <button onClick={() => handleRemoveStudent(student._id)}>Remove</button> */}
      </li>
    ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ManageCourses;  