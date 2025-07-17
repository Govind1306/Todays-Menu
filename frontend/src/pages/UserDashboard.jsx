import React, { useState, useEffect } from "react";
import EateryCard from "../components/EateryCard.jsx";
import SearchAndSort from "./SearchAndSort.jsx";
import "./UserDashboard.css";
import { supabase } from "../supabaseClient.js";

const UserDashboard = () => {
  const [eateries, setEateries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    const fetchEateries = async () => {
      const { data, error } = await supabase.from("eateries").select("*");
      if (error) {
        console.error("Error fetching eateries:", error);
      } else {
        setEateries(data);
      }
    };

    fetchEateries();
  }, []);

  const filtered = eateries
    .filter((eatery) =>
      eatery.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="user-dashboard">
      <h2 className="dashboard-heading">Explore Eateries 🍽️</h2>
      <SearchAndSort
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <div className="eateries-grid">
        {filtered.map((restaurant) => (
          <EateryCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
