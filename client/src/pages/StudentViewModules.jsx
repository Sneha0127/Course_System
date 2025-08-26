import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./StudentViewModules.css";

const StudentViewModules = () => {
  const { courseId } = useParams();
  console.log("Course ID from URL:", courseId);

  const navigate = useNavigate();
  const location = useLocation();

  const [modules, setModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const token = localStorage.getItem("token");

      const userRes = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompletedModules(userRes.data.completedModules || []);

      const modulesRes = await axios.get(
        `http://localhost:5000/api/modules/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModules(modulesRes.data || []);
    } catch (err) {
      console.error("Error fetching modules:", err);
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [courseId, location.key, location.state?.refresh]);

  if (loading) return <p className="loading-text">Loading modules...</p>;

  return (
    <div className="student-view-modules">
      <h2>Course Modules</h2>

      {modules.length === 0 ? (
        <p className="no-modules">No modules found.</p>
      ) : (
        <ul className="modules-list">
          {modules.map((module, index) => {
            const isUnlocked =
              index === 0 || completedModules.includes(modules[index - 1]._id);

            return (
              <li key={module._id} className="module-card">
                <h3>{module.title}</h3>
                <p>{module.description}</p>

                {isUnlocked ? (
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(
                        `/student/course/${courseId}/module/${module._id}`,
                        {
                          state: { courseId }, 
                        }
                      )
                    }
                  >
                    View Module
                  </button>
                ) : (
                  <button className="locked-btn" disabled>
                    Locked 
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

  
      <button
        className="back-btn"
        onClick={() => navigate(`/enrolled/${courseId}`)}
      >
        Back
      </button>
    </div>
  );
};

export default StudentViewModules;
