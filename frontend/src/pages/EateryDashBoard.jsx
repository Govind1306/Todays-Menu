import { supabase } from "../supabaseClient";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const EateryDashboard = () => {
  const { id: restId } = useParams();
  const [profile, setProfile] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [views, setViews] = useState(0);
  const [showDailyMenuForm, setShowDailyMenuForm] = useState(false);
  const [dailyMenuDate, setDailyMenuDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [dailyMenuText, setDailyMenuText] = useState("");
  const [menuImage, setMenuImage] = useState(null); // for file input
  const [dailyMenuPrice, setDailyMenuPrice] = useState(""); // NEW

  const handleSubmitDailyMenu = async () => {
    if (!dailyMenuText.trim()) return;

    const { error } = await supabase.from("menu_items").insert([
      {
        eatery_id: restId,
        date: dailyMenuDate,
        title: "Daily Menu",
        description: dailyMenuText,
      },
    ]);

    if (error) {
      console.error("Daily menu error", error);
      alert("Failed to save daily menu.");
    } else {
      alert("Daily menu saved!");
      setShowDailyMenuForm(false);
      setDailyMenuText("");
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      // Fetch eatery profile and view count
      const { data: eatery } = await supabase
        .from("eateries")
        .select("*")
        .eq("id", restId)
        .single();
      setProfile(eatery);
      setViews(eatery?.view_count || 0);

      // Fetch menu
      const { data: menu } = await supabase
        .from("menu_items")
        .select("*")
        .eq("eatery_id", restId);
      setMenuItems(menu);

      // Fetch reviews
      const { data: reviewData } = await supabase
        .from("reviews")
        .select(
          `
          id, rating, review_text, created_at,
          users ( full_name )
        `
        )
        .eq("eatery_id", restId)
        .order("created_at", { ascending: false });

      console.log(reviewData);
      setReviews(reviewData || []);
    };

    fetchAll();
  }, [restId]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "N/A";

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {profile?.name}</h1>

      {/* Profile & Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-xl shadow space-y-2">
          <h2 className="text-lg font-semibold mb-2">Business Profile</h2>
          <p>
            <strong>Name:</strong> {profile?.name}
          </p>
          <p>
            <strong>Address:</strong> {profile?.address}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Menu Items</h2>
          {menuItems?.length > 0 ? (
            menuItems.map((item) => (
              <div key={item.id} className="border-b border-gray-700 py-1">
                <p className="text-white font-semibold">{item.title}</p>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No menu items listed yet.</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3 text-white">Daily Menu</h3>

        <button
          onClick={() => setShowDailyMenuForm(!showDailyMenuForm)}
          className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4 transition"
        >
          {showDailyMenuForm ? "Cancel" : "➕ Add Daily Menu"}
        </button>
        {showDailyMenuForm && (
          <div className="p-4 border border-blue-900 rounded bg-[#0c1c3a] shadow-md max-w-md space-y-4">
            {/* Date Input */}
            <label className="block">
              <span className="text-sm font-medium text-white">Date</span>
              <input
                type="date"
                value={dailyMenuDate}
                onChange={(e) => setDailyMenuDate(e.target.value)}
                className="bg-[#1b2b4a] text-white border border-blue-800 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Title Input */}
            <label className="block">
              <span className="text-sm font-medium text-white">Title</span>
              <input
                type="text"
                value={dailyMenuText.title || ""}
                onChange={(e) =>
                  setDailyMenuText((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="e.g. Veg Thali "
                className="bg-[#1b2b4a] text-white border border-blue-800 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Description Textarea */}
            <label className="block">
              <span className="text-sm font-medium text-white">
                Description
              </span>
              <textarea
                value={dailyMenuText.description || ""}
                onChange={(e) =>
                  setDailyMenuText((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe today's menu..."
                className="bg-[#1b2b4a] text-white border border-blue-800 rounded px-3 py-2 w-full h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            {/* Price Input */}
            <label className="block">
              <span className="text-sm font-medium text-white">Price (₹)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={dailyMenuPrice}
                onChange={(e) => setDailyMenuPrice(e.target.value)}
                placeholder="e.g. 150"
                className="bg-[#1b2b4a] text-white border border-blue-800 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>

            {/* Image Upload (optional) */}
            <label className="block">
              <span className="text-sm font-medium text-white">
                Add Image (optional)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMenuImage(e.target.files[0])}
                className="text-white mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-600"
              />
            </label>

            {/* Submit Button */}
            <button
              onClick={async () => {
                if (
                  !dailyMenuText.title?.trim() ||
                  !dailyMenuText.description?.trim() ||
                  !dailyMenuPrice
                ) {
                  return alert("Title, description, and price are required");
                }

                const priceFloat = parseFloat(dailyMenuPrice);
                if (isNaN(priceFloat) || priceFloat <= 0) {
                  return alert("Enter a valid price");
                }

                const { error } = await supabase.from("menu_items").insert([
                  {
                    eatery_id: restId,
                    date: dailyMenuDate,
                    title: dailyMenuText.title.trim(),
                    description: dailyMenuText.description.trim(),
                    price: priceFloat,
                  },
                ]);

                if (error) {
                  console.error("Daily menu error", error);
                  alert("Failed to save daily menu.");
                } else {
                  alert("Daily menu saved!");
                  setShowDailyMenuForm(false);
                  setDailyMenuText("");
                  setDailyMenuPrice(""); // clear the price field
                }
              }}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded transition"
            >
              ✅ Submit
            </button>
          </div>
        )}
      </div>

      {/* Views & Ratings */}
      <div className="bg-gray-800 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Views & Ratings</h2>
        <div className="flex flex-wrap gap-6 mb-4">
          <div>
            <p className="text-sm text-gray-400">Total Views</p>
            <p className="text-xl font-bold">{views}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Average Rating</p>
            <p className="text-xl font-bold">{averageRating}</p>
          </div>
        </div>

        <div className="space-y-4">
          {reviews?.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">
                    {rev.users?.full_name || "Anonymous"}
                  </span>
                  <span className="text-yellow-400">⭐ {rev.rating}</span>
                </div>
                <p className="text-sm text-gray-300 mb-1">
                  {rev.review_text || "No written feedback"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EateryDashboard;
