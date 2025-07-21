import React from "react";
import "./EateryCard.css";
import { useNavigate } from "react-router-dom";

const EateryCard = ({ restaurant }) => {
  const { name, image, type, address, rating } = restaurant;

  const navigate = useNavigate();

  const handleClick = () => {
    // You can replace this with navigation logic
    console.log("Clicked:", name);
    navigate("/eateries/" + restaurant.id);
  };

  return (
    <div className="restaurant-card" onClick={handleClick}>
      <div className="restaurant-image-wrapper">
        <img
          src={"fallback.jpg"}
          // alt={"../assets/fallback.jpg"}
          className="restaurant-img"
        />
        {rating >= 4.5 && <div className="badge">Top Rated</div>}
      </div>

      <div className="restaurant-details">
        <h3 className="restaurant-name">{name}</h3>
        <p className="restaurant-type">
          <strong>Type:</strong> {type}
        </p>
        <p className="restaurant-address">
          <strong>Address:</strong> {address}
        </p>
        <p className="restaurant-rating">
          <strong>Rating:</strong> ⭐ {rating}
        </p>
      </div>
    </div>
  );
};

export default EateryCard;
