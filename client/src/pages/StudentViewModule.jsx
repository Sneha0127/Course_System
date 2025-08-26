import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./StudentViewModule.css";

const StudentViewModule = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  //Get courseId from query params OR state
  const queryParams = new URLSearchParams(location.search);
  const courseIdFromQuery = queryParams.get("courseId");
  const courseIdFromState = location.state?.courseId;
  const [courseId, setCourseId] = useState(courseIdFromQuery || courseIdFromState || "");

  const [module, setModule] = useState(null);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch module details & update courseId
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/modules/${moduleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched module:", res.data);

        const resolvedCourseId = res.data.course?._id || res.data.course || courseId;

        setModule({ ...res.data, courseId: resolvedCourseId });
        if (!courseId) setCourseId(resolvedCourseId);
      } catch (err) {
        console.error("Error fetching module:", err);
        setError("Failed to fetch module. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  //Handle answer selection
  const handleAnswerChange = (quesSetId, questionIndex, option) => {
    if (module?.isCompleted) return;
    setAnswers((prev) => ({
      ...prev,
      [quesSetId]: { ...prev[quesSetId], [questionIndex]: option },
    }));
  };

  //Handle quiz submission
  const handleSubmitQuiz = async (quesSetId) => {
    try {
      const token = localStorage.getItem("token");
      const userAnswers = answers[quesSetId] || {};

      const res = await axios.post(
        `http://localhost:5000/api/modules/${moduleId}/quesSet/${quesSetId}/submit`,
        { answers: Object.values(userAnswers) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.alreadyCompleted) {
        setMessage("You already completed this module.");
      } else if (res.data.passed) {
        setMessage("Quiz passed! Next module unlocked!");
      } else {
        setMessage("Quiz failed. Try again!");
        return;
      }

      const resolvedCourseId = module.course?._id || module.course || courseId;

      setTimeout(() => {
        navigate(`/student/course/${resolvedCourseId}/modules`, {
          state: { refresh: Date.now(), courseId: resolvedCourseId },
          replace: true,
        });
      }, 1200);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setMessage("Error submitting quiz. Please try again.");
    }
  };

  if (loading) return <p>Loading module...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!module) return <p>Module not found.</p>;

  const quizLocked = !!module.isCompleted;

  return (
    <div className="module-container">
      <h2 className="module-title">{module.title}</h2>
      <p className="module-description">{module.description}</p>

      {module.quesSet && module.quesSet.length > 0 ? (
        module.quesSet.map((qs) => (
          <div key={qs._id} className="ques-set-card">
            <h3 className="ques-set-title">{qs.title}</h3>

            {qs.quiz && qs.quiz.length > 0 ? (
              qs.quiz.map((q, index) => {
                return (
                  <div key={index}>
                    <p className="question">
                      {index + 1}. {q.question}
                    </p>
                    {q.options.map((opt, i) => {
                      const isCorrectOpt = module.isCompleted && opt === q.correctAnswer;
                      return (
                        <label
                          key={i}
                          className={`option-label ${isCorrectOpt ? "correct-option" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`q-${qs._id}-${index}`}
                            value={opt}
                            checked={answers[qs._id]?.[index] === opt}
                            onChange={() => handleAnswerChange(qs._id, index, opt)}
                            disabled={quizLocked}
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <p>No quiz available in this set.</p>
            )}

            {!quizLocked && (
              <button onClick={() => handleSubmitQuiz(qs._id)} className="submit-btn">
                Submit Quiz
              </button>
            )}
            {quizLocked && <p className="message">You have already completed this module.</p>}
          </div>
        ))
      ) : (
        <p>No quizzes available for this module.</p>
      )}

    
      <button
        className="submit-btn"
        onClick={() =>
          navigate(`/student/course/${courseId}/modules`, {
            state: { refresh: Date.now(), courseId },
          })
        }
      >
        Back
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default StudentViewModule;
