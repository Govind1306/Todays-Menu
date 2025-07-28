// src/components/EateryCard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { supabase } from "../supabaseClient";

const EateryCard = ({ restaurant, userWishlist, userId, setUserWishlist }) => {
  const { id, name, image, type, address, rating, distance } = restaurant;
  const [wishlisted, setWishlisted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setWishlisted(userWishlist?.includes(id));
  }, [userWishlist, id]);

  const handleClick = () => navigate(`/eateries/${id}`);

  const toggleWishlist = async (e) => {
    e.stopPropagation();

    const newState = !wishlisted;
    setWishlisted(newState);

    const newWishlist = newState
      ? [...(userWishlist || []), id]
      : userWishlist.filter((eid) => eid !== id);

    const { error } = await supabase
      .from("users")
      .update({ wishlist: newWishlist })
      .eq("id", userId);

    if (error) {
      console.error("Error updating wishlist:", error);
      setWishlisted(!newState); // rollback
    } else {
      setUserWishlist(newWishlist);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer relative border border-gray-200"
    >
      <div className="relative h-44 bg-gray-100">
        <img
          src={image || "/fallback.jpg"}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Heart Icon */}
        <div
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full shadow hover:scale-105 transition"
          onClick={toggleWishlist}
        >
          <Heart
            fill={wishlisted ? "#ef4444" : "none"}
            stroke="#1e3a8a"
            className="w-5 h-5"
          />
        </div>

        {/* Top Rated Badge */}
        {rating >= 4.5 && (
          <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
            Top Rated
          </div>
        )}
      </div>

      <div className="p-4 space-y-1.5">
        <h3 className="text-lg font-semibold text-blue-900">{name}</h3>
        <p className="text-sm text-blue-800 font-medium">{type}</p>
        <p className="text-sm text-gray-600 truncate">{address}</p>
        <p className="text-sm text-gray-700">
          <span className="font-medium text-blue-900">Rating:</span> ⭐ {rating}
        </p>
        {restaurant.distance != null && (
          <p className="text-sm text-gray-500 italic">
            {restaurant.distance.toFixed(1)} km away
          </p>
        )}
      </div>
    </div>
  );
};

export default EateryCard;
