import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewModules.css";

const ViewModules = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/modules/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setModules(res.data);
      } catch (err) {
        console.error("Error fetching modules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  const handleModuleClick = (moduleId) => {
    navigate(`/view-module/${courseId}/${moduleId}`);
  };

  if (loading) {
    return <p className="loading">Loading modules...</p>;
  }

  return (
  <div className="bg1">
    <div className="view-modules-container">
      <h1 className="page-title">Course Modules</h1>
      {modules.length > 0 ? (
        modules.map((module) => (
          <div
          key={module._id}
          className="module-card clickable"
          onClick={() => handleModuleClick(module._id)}
          >
            <h2 className="module-title">{module.title}</h2>
            <p className="module-description">{module.description}</p>
          </div>
        ))
      ) : (
        <p className="no-modules">No modules created yet.</p>
      )}

      <button className="submit-btn" onClick={()=>navigate(`/add-modules/${courseId}`)}>Back</button>
    </div>
  </div>
  );
};

export default ViewModules;
