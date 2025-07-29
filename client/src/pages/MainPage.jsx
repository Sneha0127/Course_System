import React from "react";
import { useNavigate  } from "react-router-dom";
import "./MainPage.css"; 

function MainPage() {
  const navigate = useNavigate();
    // const token = localStorage.getItem("token");
     const role = localStorage.getItem("role");

  return (
    <div className="mp-wrapper">
      <video
        className="background-video"
        src="/102055-658840495_tiny.mp4"
        autoPlay  muted  loop  playsInline
      ></video>

    <div className="mp-container">
      <button className="back-button" onClick={() => navigate(`/${role}`)}>
        ← Back
      </button>

      <h1 className="project-title">@Courses.inn</h1>

      <p className="project-description">
     <u>@Courses.inn</u>  is a full-stack web application designed to streamline the process of course creation, management, and enrollment. It serves as a platform where administrators can efficiently manage courses—adding, updating, or deleting them—while students can browse available courses, search for specific topics, and enroll with ease.
       Built using React for the frontend and Node.js with Express.js for the backend, this system ensures a dynamic, responsive, and user-friendly experience. MongoDB is used to store course and user data securely, and role-based authentication helps maintain access control for admins and students.
      Whether used in an academic environment or a corporate training setup, this system offers scalable, modular features to manage learning content effectively.
      </p>

      <div className="creator-info">
        <h3>Know More:</h3>
        <p><strong>Creator:</strong> Sneha Pandey</p>
        <p><strong>Linkedln:</strong><a href="https://www.linkedin.com/in/sneha-pandey-ab63b7260/"><u>Link</u></a> </p>
        <p><strong>Github:</strong><a href="https://github.com/Sneha0127"><u>Link</u></a> </p>
        <p><strong>Skills Used:</strong> React, Node.js, Express, MongoDB, CSS</p>
      </div>
    </div>
    </div>
  );
}

export default MainPage;
