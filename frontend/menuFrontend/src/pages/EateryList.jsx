import React from "react";
import EateryCard from "../components/EateryCard"; // ✅ matches your file name
import "./EateryList.css"; // ✅ page-specific styling
import { restaurants } from "../../dummyData/eataries.js"; // ✅ adjust path if needed
import { useNavigate } from "react-router-dom"; // ✅ for navigation

const EateryList = () => {
  const navigate = useNavigate();
  return (
    <div className="restaurant-wrapper">
      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <div onClick={() => navigate(`/eatery/${restaurant.id}`)}>
            <EateryCard key={restaurant.id} restaurant={restaurant} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EateryList;
