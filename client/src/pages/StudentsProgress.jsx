import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentsProgress.css";

const StudentsProgress = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch enrolled students
        const studentsRes = await axios.get(
          `http://localhost:5000/api/courses/students/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(studentsRes.data);

        // Fetch modules of this course
        const modulesRes = await axios.get(
          `http://localhost:5000/api/modules/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setModules(modulesRes.data);
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    fetchProgress();
  }, [courseId]);

  const getUnlockedCount = (studentId) => {
    return modules.filter((mod) => mod.unlockedBy.includes(studentId)).length;
  };

  return (
    <div className="students-progress-container">
      <h1>Students Progress</h1>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>Unlocked Modules</th>
            <th>Total Modules</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{getUnlockedCount(student._id)}</td>
              <td>{modules.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="submit-btn"
        onClick={() => navigate(`/add-modules/${courseId}`)}
      >
        Back
      </button>
    </div>
  );
};

export default StudentsProgress;
