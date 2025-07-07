import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [editCourseId, setEditCourseId] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editCourseId) {
        await axios.put(
          `http://localhost:5000/api/courses/admin/course/${editCourseId}`,
          { title, description,image, price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditCourseId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/courses/create",
          { title, description ,image,price},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setTitle("");
      setDescription("");
      setImage("");
      setPrice("");
      fetchCourses();
    } catch (err) {
      console.error("Create/Update error:", err.message);
    }
  };

  const handleEdit = (course) => {
  setTitle(course.title);
  setDescription(course.description);
  setImage(course.image || "");
  setPrice(course.price || "");
  setEditCourseId(course._id);
};


  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/courses/admin/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const handleViewStudents = async (courseId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/students/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const selectedCourse = courses.find((c) => c._id === courseId);
      setStudents(res.data);
      setSelectedCourseId(courseId);
      setSelectedCourseName(selectedCourse?.title || "Selected Course");
    } catch (err) {
      console.error("Student fetch error:", err.message);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!selectedCourseId) return;
    if (!window.confirm("Remove this student from the course?")) return;

    try {
      await axios.put(
        `http://localhost:5000/api/courses/admin/course/${selectedCourseId}/remove-student/${studentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleViewStudents(selectedCourseId);
    } catch (err) {
      console.error("Remove student error:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
     navigate("/login");
  };

  useEffect(() => {
  if (!token) {
    navigate("/login");
  } else {
    fetchCourses();
  }
}, []);


  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          cols="50"
        />
        <br />
          <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <br />
        <input
          type="number"
          placeholder="Price (in ₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
       <button onClick={handleCreateOrUpdate}>
    {editCourseId ? "Update Course" : "Create Course"}
  </button>
  {editCourseId && (
    <button
      onClick={() => {
        setEditCourseId(null);
        setTitle("");
        setDescription("");
        setImage("");
        setPrice("");
      }}
      style={{ marginLeft: "10px" }}
    >
      Cancel Edit
    </button>
        )}
      </div>

      <ul>
        {courses.length === 0 ? (
          <li>No courses found.</li>
        ) : (
          courses.map((course) => (
            <li key={course._id} style={{ marginBottom: "10px" }}>
              <strong>{course.title}</strong>: {course.description}
              <br />
              <button onClick={() => handleDelete(course._id)}>Delete</button>{" "}
              <button onClick={() => handleEdit(course)}>Edit</button>{" "}
              <button onClick={() => handleViewStudents(course._id)}>View Students</button>
            </li>
          ))
        )}
      </ul>

      {students.length > 0 && (
        <div style={{ marginTop: "30px" }}>
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

export default AdminDashboard;
