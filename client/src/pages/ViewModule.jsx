import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ViewModules.css";

const ViewModule = () => {
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/modules/${moduleId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setModule(res.data);
      } catch (err) {
        console.error("Error fetching module:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  if (loading) {
    return <h2 style={{ textAlign: "center", color: "#00ff88" }}>Loading module...</h2>;
  }

  if (!module) {
    return <p style={{ textAlign: "center", color: "white" }}>Module not found.</p>;
  }

  return (
    <div className="view-modules-container">
      {/* Module Title */}
      <h1 className="page-title">{module.title}</h1>

      {/* Module Description */}
      <p className="module-description">{module.description}</p>

      {/* Quiz Sets */}
      {module.quesSet && module.quesSet.length > 0 ? (
        module.quesSet.map((set) => (
          <div key={set._id} className="quiz-section">
            <h3 style={{ color: "#00ff88" }}>
              {set.title} ({set.type})
            </h3>

            {/* Quizzes inside the Question Set */}
            {set.quiz && set.quiz.length > 0 ? (
              set.quiz.map((q, qIndex) => (
                <div key={q._id} className="quiz-block">
                  <p className="quiz-question">
                    {qIndex + 1}. {q.question}
                  </p>
                  <ul className="quiz-options">
                    {q.options.map((opt, optIndex) => {
                      const isCorrect = opt === q.correctAnswer;
                      return (
                        <li
                          key={optIndex}
                          className={`quiz-option ${isCorrect ? "correct-option" : ""}`}
                        >
                          {opt}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            ) : (
              <p style={{ color: "white" }}>No quizzes in this set.</p>
            )}
          </div>
        ))
      ) : (
        <p style={{ color: "white" }}>No quiz sets for this module.</p>
      )}

      {/* Back Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to={`/view-modules/${courseId}`} className="submit-quiz-btn">
          Back to Modules
        </Link>
      </div>
    </div>
  );
};

export default ViewModule;
