import React, { useState, useEffect, useMemo } from "react";
import EateryCard from "../components/EateryCard";
import SearchAndSort from "./SearchAndSort";
import { supabase } from "../supabaseClient";

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const UserDashboard = () => {
  const [eateries, setEateries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [userWishlist, setUserWishlist] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showOnlyWishlisted, setShowOnlyWishlisted] = useState(false);
  const [location, setLocation] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(1000000);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setLocation({ latitude: coords.latitude, longitude: coords.longitude }),
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
      else console.error(error);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchWishlist = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("wishlist")
        .eq("id", userId)
        .single();
      if (!error) setUserWishlist(data?.wishlist || []);
      else console.error("Error fetching wishlist:", error);
    };
    fetchWishlist();
  }, [userId]);

  useEffect(() => {
    const fetchEateries = async () => {
      // Call the database function using rpc
      const { data, error } = await supabase.rpc(
        "get_eateries_with_geojson_location"
      );
      if (!error) {
        setEateries(data || []);
      } else {
        console.error("Error fetching eateries:", error);
      }
    };
    fetchEateries();
  }, []);

  const enhancedEateries = useMemo(() => {
    return eateries.map((eatery) => {
      let distance = null;
      // Now, eatery already has 'latitude' and 'longitude' because of the RPC function
      if (location && eatery.latitude !== null && eatery.longitude !== null) {
        distance = haversineDistance(
          location.latitude,
          location.longitude,
          eatery.latitude,
          eatery.longitude
        );
      }
      return { ...eatery, distance };
    });
  }, [eateries, location]);

  const filtered = enhancedEateries
    .filter((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((e) => (showOnlyWishlisted ? userWishlist.includes(e.id) : true))
    .filter((e) => {
      // Ensure eatery.distance is not null before applying filter
      if (!location || e.distance == null) return true;
      return e.distance <= distanceFilter;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="bg-slate-900 min-h-screen text-white p-6 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-sky-400">
        Explore Eateries 🍽️
      </h2>

      <div className="bg-slate-800 p-4 rounded-xl shadow mb-6">
        <SearchAndSort
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <button
            onClick={() => setShowOnlyWishlisted((prev) => !prev)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            {showOnlyWishlisted ? "Show All" : "Show Only Wishlisted"}
          </button>

          <div className="flex items-center gap-3">
            <label className="font-medium">Distance (km):</label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(Number(e.target.value))}
              className="accent-sky-400"
            />
            <span className="text-sky-300 text-sm">{distanceFilter} km</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((restaurant) => (
          <EateryCard
            key={restaurant.id}
            restaurant={restaurant}
            userId={userId}
            userWishlist={userWishlist}
            setUserWishlist={setUserWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
