import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AddModules.css'; // keep custom styling

const AddModules = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Add a new module
  const handleAddModule = () => {
    if (modules.length >= 5000) return;
    setModules([
      ...modules,
      {
        title: '',
        description: '',
        order: modules.length + 1, 
        quesSet: [],
      },
    ]);
  };

  //  Add a new question set (quiz set) inside a module
  const handleAddQuesSet = (modIndex) => {
    const updated = [...modules];
    updated[modIndex].quesSet.push({
      title: `Quiz Set ${updated[modIndex].quesSet.length + 1}`,
      type: 'quiz', // backend defaults anyway, but safe
      quiz: [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
        },
      ],
    });
    setModules(updated);
  };

  // Add another question to a quiz set
  const handleAddQuestion = (modIndex, qsIndex) => {
    const updated = [...modules];
    updated[modIndex].quesSet[qsIndex].quiz.push({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    });
    setModules(updated);
  };

  // Module field change
  const handleModuleChange = (modIndex, field, value) => {
    const updated = [...modules];
    updated[modIndex][field] = value;
    setModules(updated);
  };

  //Quiz question change
  const handleQuizChange = (modIndex, qsIndex, qIndex, field, value) => {
    const updated = [...modules];
    updated[modIndex].quesSet[qsIndex].quiz[qIndex][field] = value;
    setModules(updated);
  };

  // Quiz option change
  const handleOptionChange = (modIndex, qsIndex, qIndex, optIndex, value) => {
    const updated = [...modules];
    updated[modIndex].quesSet[qsIndex].quiz[qIndex].options[optIndex] = value;
    setModules(updated);
  };

  //Submit modules
  const handleSubmit = async () => {
    try {
      for (const module of modules) {
        await axios.post(
          `http://localhost:5000/api/modules/${courseId}`,
          {
            title: module.title,
            description: module.description,
            order: module.order,
            quesSet: module.quesSet,
          },
          {
          headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
          }
        );
      }
      alert('Modules created successfully!');
      setModules([]);
      navigate(`/view-modules/${courseId}`);
    } catch (error) {
      console.error(error);
      alert('Error creating modules');
    }
  };

  return (
    <div className="add-modules-container">
      <h1 className="main-title">Add Modules for Course</h1>
      <button className="add-module-btn" onClick={handleAddModule}>
        Add Module
      </button>
      <button className="add-question-btn" onClick={() => navigate(`/view-modules/${courseId}`)}>
        View Modules
      </button>
      <button className='add-question-btn' onClick={()=>navigate(`/admin/course/${courseId}/students`)}>View Student's Progress</button>
      <button className="add-module-btn" onClick={()=>navigate('/admin/manage-courses')}>Back</button>

      {modules.map((mod, modIndex) => (
        <div key={modIndex} className="module-box">
          <h2 className="module-title">Module {mod.order}</h2>

          <input
            type="text"
            className="input"
            placeholder="Module Title"
            value={mod.title}
            onChange={(e) => handleModuleChange(modIndex, 'title', e.target.value)}
          />
          <textarea
            className="textarea"
            placeholder="Module Description"
            value={mod.description}
            onChange={(e) => handleModuleChange(modIndex, 'description', e.target.value)}
          />

          <button className="add-quizset-btn" onClick={() => handleAddQuesSet(modIndex)}>
            Add Quiz Set
          </button>

          {mod.quesSet.map((qs, qsIndex) => (
            <div key={qsIndex} className="quizset-box">
              <h3>{qs.title}</h3>

              {qs.quiz.map((q, qIndex) => (
                <div key={qIndex} className="question-box">
                  <label>Question {qIndex + 1}</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) =>
                      handleQuizChange(modIndex, qsIndex, qIndex, 'question', e.target.value)
                    }
                  />
                  {[0, 1, 2, 3].map((optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      className="input"
                      placeholder={`Option ${optIndex + 1}`}
                      value={q.options[optIndex]}
                      onChange={(e) =>
                        handleOptionChange(modIndex, qsIndex, qIndex, optIndex, e.target.value)
                      }
                    />
                  ))}
                  <input
                    type="text"
                    className="input"
                    placeholder="Correct Answer (must match one option)"
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleQuizChange(modIndex, qsIndex, qIndex, 'correctAnswer', e.target.value)
                    }
                  />
                </div>
              ))}

              <button
                className="add-question-btn"
                onClick={() => handleAddQuestion(modIndex, qsIndex)}
              >
                Add Question
              </button>
            </div>
          ))}
        </div>
      ))}

      {modules.length > 0 && (
        <button className="submit-btn" onClick={handleSubmit}>
          Save All Modules
        </button>
      )}
    </div>
  );
};

export default AddModules;
