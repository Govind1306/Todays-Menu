// src/components/TodayMenuForm.jsx
import React, { useState } from "react";
import "./TodayMenuForm.css";

const TodayMenuForm = () => {
  const [type, setType] = useState("text"); // "text" or "image"
  const [textMenu, setTextMenu] = useState("");
  const [imageMenu, setImageMenu] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      date: new Date().toISOString().split("T")[0],
      type,
      value: type === "text" ? textMenu : imageMenu,
    };

    console.log("Submitted Menu:", payload);
    setSubmitted(true);
  };

  return (
    <div className="menu-form-container">
      {submitted ? (
        <div className="submitted-box">
          <h3>✅ Menu Submitted</h3>
          <p>Thanks! Your menu is now live for today.</p>
        </div>
      ) : (
        <form className="menu-form" onSubmit={handleSubmit}>
          <div className="menu-type-toggle">
            <label>
              <input
                type="radio"
                name="menuType"
                value="text"
                checked={type === "text"}
                onChange={() => setType("text")}
              />
              Enter Menu as Text
            </label>
            <label>
              <input
                type="radio"
                name="menuType"
                value="image"
                checked={type === "image"}
                onChange={() => setType("image")}
              />
              Upload Menu Image
            </label>
          </div>

          {type === "text" ? (
            <textarea
              placeholder="Write your full menu here..."
              value={textMenu}
              onChange={(e) => setTextMenu(e.target.value)}
              required
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageMenu(e.target.files[0])}
              required
            />
          )}

          <button type="submit" className="primary-btn">
            Submit Menu
          </button>
        </form>
      )}
    </div>
  );
};

export default TodayMenuForm;
