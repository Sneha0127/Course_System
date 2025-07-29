import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onCourseSelect }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch enrolled courses once on component mount
  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrolledCourses(res.data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      }
    };

    fetchEnrolled();
  }, [token]);

  // Fetch suggestions with debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length >= 2) {
        try {
          const res = await axios.get(`http://localhost:5000/api/courses/search?query=${encodeURIComponent(input)}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSuggestions(res.data);
        } catch (err) {
          console.error("Error fetching suggestions:", err);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceFetch = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceFetch);
  }, [input, token]);

  // Check if course is enrolled 
  const handleClick = (courseId) => {
    if (onCourseSelect) {
      onCourseSelect(courseId); 
    } else {
      const isEnrolled = enrolledCourses.some(course => course._id === courseId);
      if (isEnrolled) {
        navigate(`/enrolled/${courseId}`);
      } else {
        navigate(`/course/${courseId}`);
      }
    }
  };


 return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search courses..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {input.length >= 2 && (
        <ul className="suggestions-list">
          {suggestions.map((course) => (
            <li key={course._id} onClick={() => handleClick(course._id)}>
              {course.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;    