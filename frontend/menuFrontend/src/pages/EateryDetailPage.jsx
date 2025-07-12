// src/pages/EateryDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EateryDetailPage.css";

// Dummy placeholder data — later will be replaced with API fetch
const dummyEateries = [
  {
    id: "1",
    name: "Govind's Dosa Corner",
    description:
      "Authentic South Indian cuisine with crispy dosas and chutneys.",
    location: "Pune, Maharashtra",
    coverImage: "/assets/dosa-banner.jpg",
    todayMenu: {
      type: "text",
      value: "Masala Dosa, Medu Vada, Filter Coffee, Idli Sambhar",
      date: "2025-07-12",
    },
  },
  {
    id: "2",
    name: "Chaai Adda",
    description: "Your daily chai stop with pakodas and desi vibes.",
    location: "Nagpur, Maharashtra",
    coverImage: "/assets/chaai-cover.jpg",
    todayMenu: {
      type: "image",
      value: "/assets/menu-chaai.jpg",
      date: "2025-07-12",
    },
  },
];

const EateryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eatery, setEatery] = useState(null);

  useEffect(() => {
    // In real backend, this would be an API fetch like:
    // fetch(`/api/eatery/${id}`).then(...)

    const found = dummyEateries.find((e) => e.id === id);
    setEatery(found);
  }, [id]);

  if (!eatery) {
    return (
      <div className="eatery-detail-container">
        <p>Eatery not found.</p>

        <button
          onClick={() => {
            navigate("/eateries");
            console.log("ss");
          }}
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="eatery-detail-container">
      <button className="back-btn" onClick={() => navigate("/eateries")}>
        ← Back to Eateries
      </button>

      <div className="eatery-cover">
        <img src={eatery.coverImage} alt={eatery.name} />
      </div>

      <div className="eatery-info">
        <h2>{eatery.name}</h2>
        <p className="location">{eatery.location}</p>
        <p className="desc">{eatery.description}</p>
      </div>

      <div className="menu-section">
        <h3>Today's Menu</h3>
        {eatery.todayMenu.type === "text" ? (
          <p className="menu-text">{eatery.todayMenu.value}</p>
        ) : (
          <img
            className="menu-img"
            src={eatery.todayMenu.value}
            alt="Today's Menu"
          />
        )}
      </div>
    </div>
  );
};

export default EateryDetailPage;
