import React from "react";
import "./EateryCard.css";

const EateryCard = ({ restaurant }) => {
  const { name, image, type, address, rating } = restaurant;

  return (
    <div className="restaurant-card">
      <img src={image} alt={name} className="restaurant-img" />
      <div className="restaurant-details">
        <h3>{name}</h3>
        <p>
          <strong>Type:</strong> {type}
        </p>
        <p>
          <strong>Address:</strong> {address}
        </p>
        <p>
          <strong>Rating:</strong> ⭐ {rating}
        </p>
      </div>
    </div>
  );
};

export default EateryCard;
