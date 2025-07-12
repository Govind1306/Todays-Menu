// src/pages/RegisterEateryForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterEateryForm.css";

const RegisterEateryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    pincode: "",
    cuisine: [],
    logo: null,
    coverImage: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const cuisines = [
    "South Indian",
    "North Indian",
    "Chinese",
    "Snacks",
    "Desserts",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleCuisineToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      cuisine: prev.cuisine.includes(tag)
        ? prev.cuisine.filter((c) => c !== tag)
        : [...prev.cuisine, tag],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Eatery:", formData);
    setSubmitted(true);
  };

  return (
    <div className="eatery-form-container">
      {submitted ? (
        <div className="eatery-form">
          <h2>🎉 Submitted for Verification</h2>
          <p>Your eatery details have been submitted successfully.</p>
          <p>We’ll notify you once it’s verified and live in the app.</p>
          <p>Thanks for joining us, Govind! 👨‍🍳</p>
        </div>
      ) : (
        <form className="eatery-form" onSubmit={handleSubmit}>
          <h2>Register Your Eatery</h2>

          <label>Eatery Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Short Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label>Full Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <div className="inline-fields">
            <div>
              <label>City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Pincode</label>
              <input
                name="pincode"
                type="number"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Cuisine Types</label>
          <div className="cuisine-tags">
            {cuisines.map((tag) => (
              <span
                key={tag}
                className={
                  formData.cuisine.includes(tag) ? "tag selected" : "tag"
                }
                onClick={() => handleCuisineToggle(tag)}
              >
                {tag}
              </span>
            ))}
          </div>

          <label>Upload Logo</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
          />

          <label>Upload Cover Image</label>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleFileChange}
          />

          <button type="submit" className="primary-btn">
            Submit for Verification
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterEateryForm;
