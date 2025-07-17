import React, { useEffect, useState } from "react";
import EateryCard from "../components/EateryCard";
import "./EateryList.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const EateryList = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEateries = async () => {
      setLoading(true); // just to be safe

      const { data, error } = await supabase
        .from("eateries")
        .select("id, name, city,  created_at"); // select only what's needed

      if (error) {
        console.error("Error fetching eateries:", error.message);
      } else {
        setRestaurants(data);
      }

      setLoading(false);
    };

    fetchEateries();
  }, []);

  if (loading) return <p>Loading eateries...</p>;

  return (
    <div className="restaurant-wrapper">
      {restaurants.length === 0 ? (
        <p>No eateries found.</p>
      ) : (
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => navigate(`/eatery/${restaurant.id}`)}
            >
              <EateryCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EateryList;
