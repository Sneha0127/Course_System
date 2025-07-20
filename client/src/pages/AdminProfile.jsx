import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import "./StudentProfile.css";

const DEFAULT_IMAGE = 'data:image/jpeg;base64,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'; // You should place this image in public folder

const AdminProfile = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    description: '',
    profilePicture: '',
    profilePictureFile: null,
  });
  const navigate=useNavigate();
    const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
    //    console.log(localStorage.getItem("token"))
        setForm((prev) => ({
          ...prev,
          name: res.data.name || '',
          email: res.data.email || '',
          age: res.data.age || '',
          gender: res.data.gender || '',
          description: res.data.description || '',
          profilePicture: res.data.profilePicture || DEFAULT_IMAGE,
        }));
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profilePicture') {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        profilePictureFile: file,
        profilePicture: URL.createObjectURL(file), // Preview
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("age", form.age);
    formData.append("gender", form.gender);
    formData.append("description", form.description);
    if (form.profilePictureFile) {
      formData.append("profilePicture", form.profilePictureFile);
    }

    try {
      await axios.put('http://localhost:5000/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated!");
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  return (
    <div className="wrapp">
    <button className="back-button"  onClick={() => navigate(`/${role}`)}>
        ← Back
      </button>
    <div className="profile-container">
      <h2>Me</h2>
      <form onSubmit={handleSubmit}>

        {/* Profile Image */}
        <div>
          <img
            src={
                form.profilePicture?.startsWith("/uploads/")
                ? `http://localhost:5000${form.profilePicture}`
                : form.profilePicture || DEFAULT_IMAGE
            }
            alt="Profile"
            width="120"
            height="120"
            />
        </div>

       <div>
  <label htmlFor="profilePic" className="edit-button">
    Edit
  </label>
  <input
    type="file"
    id="profilePic"
     name="profilePicture"
    accept="image/*"
    style={{ display: 'none' }}
    onChange={handleChange}
  />
</div>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          />

        <input
          type="email"
          name="email"
          value={form.email}
          readOnly
          />

        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          />

        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="About you"
          />

        <button type="submit">Update Profile</button>
      </form>
    </div>
</div>
  );
};

export default AdminProfile;
