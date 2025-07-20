import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [editCourseId, setEditCourseId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseToEdit = queryParams.get("edit");

  useEffect(() => {
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    localStorage.clear(); 
    navigate("/login", { replace: true });
    return;
  }

  if (courseToEdit) {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseToEdit}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const course = res.data;
        setTitle(course.title);
        setDescription(course.description);
        setImage(course.image);
        setPrice(course.price);
        setEditCourseId(course._id);
      } catch (err) {
        console.error("Failed to fetch course for editing", err.message);
      }
    };

    fetchCourse();
  }
}, [courseToEdit, token, navigate]);

  const handleCreateOrUpdate = async () => {
    try {
      const url = editCourseId
        ? `http://localhost:5000/api/courses/admin/course/${editCourseId}`
        : `http://localhost:5000/api/courses/create`;

      const method = editCourseId ? "put" : "post";

      await axios[method](
        url,
        { title, description, image, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setDescription("");
      setImage("");
      setPrice("");
      setEditCourseId(null);
      navigate("/admin"); 
    } catch (err) {
      console.error("Error creating/updating course:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="outer">
        <h1 className="mainn1" onClick={()=>{navigate("/main")}}>@Courses.inn</h1>
       <button className="btnn1" onClick={() => navigate('/admin/profile')}>Profile</button>
      <button className="btnn2" onClick={handleLogout}>Logout</button>

    <div className="a-container">
      <div className="a-header">
        
        <h2>Admin's Creation</h2>
        <div>
          <button onClick={() => navigate("/admin/manage-courses")}>Manage Courses</button>
        </div>
      </div>

      <div className="a-form">
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          />

        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          />

        <input
          type="number"
          placeholder="Price (in ₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          />

        <div>
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
                navigate("/admin"); // optional: clear ?edit= from URL
              }}
              className="cancel-edit"
              style={{ marginLeft: "10px" }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>
    </div>
</div>
  );
}

export default AdminDashboard;
