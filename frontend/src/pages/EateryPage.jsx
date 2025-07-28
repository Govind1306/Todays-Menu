import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const EateryPage = () => {
  const { id } = useParams(); // eatery ID from URL
  const [eatery, setEatery] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userWishlist, setUserWishlist] = useState([]);

  // Fetch Eatery Details
  useEffect(() => {
    const fetchEatery = async () => {
      const { data, error } = await supabase
        .from("eateries")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setEatery(data);
    };

    fetchEatery();
  }, [id]);

  // Fetch Current User Wishlist
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from("users")
          .select("wishlist")
          .eq("id", user.id)
          .single();
        if (!error && data?.wishlist) {
          setUserWishlist(data.wishlist);
          setIsWishlisted(data.wishlist.includes(id));
        }
      }
    };

    fetchUser();
  }, [id]);

  // Toggle Wishlist Button
  const toggleWishlist = async () => {
    const updatedWishlist = isWishlisted
      ? userWishlist.filter((eid) => eid !== id)
      : [...userWishlist, id];

    // Instant UI feedback
    setIsWishlisted(!isWishlisted);
    setUserWishlist(updatedWishlist);

    await supabase
      .from("users")
      .update({ wishlist: updatedWishlist })
      .eq("id", userId);
  };

  // Fetch Menu Items for this Eatery
  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("eatery_id", id)
        .order("date", { ascending: false });

      if (!error) setMenuItems(data);
    };

    if (id) fetchMenuItems();
  }, [id]);

  return (
    <div className="p-6">
      {eatery ? (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{eatery.name}</h1>
            <button onClick={toggleWishlist} className="text-red-500 text-xl">
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
          <p className="text-gray-600">{eatery.description}</p>
        </div>
      ) : (
        <p>Loading eatery...</p>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Menu</h2>
        {menuItems.length > 0 ? (
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 shadow">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {new Date(item.date).toDateString()}
                  </span>
                  <span className="text-green-600 font-semibold">
                    ₹{item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No menu items available.</p>
        )}
      </div>
    </div>
  );
};

export default EateryPage;
