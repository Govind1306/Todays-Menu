import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Heading2 } from "lucide-react";

const CustomerInteractionTab = ({ restId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          id,
          rating,
          review_text,
          reply,
          created_at,
          user_id,
          users (
            full_name
          )
        `
        )
        .eq("eatery_id", restId)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching reviews:", error);
      else setReviews(data);
    };

    fetchReviews();
  }, [restId]);

  const handleReply = async (reviewId, reply) => {
    await supabase.from("reviews").update({ reply }).eq("id", reviewId);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reply } : r))
    );
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Interact with Customers</h2>
      {reviews.length > 0 ? (
        reviews.map((rev) => (
          <div key={rev.id} className="border p-4 rounded mb-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {rev.users?.full_name || "Anonymous"}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(rev.created_at).toLocaleDateString()}
              </p>
            </div>
            <p className="text-yellow-500 mb-2">⭐ {rev.rating}</p>
            <p className="text-gray-800 mb-2">{rev.review_text}</p>
            <input
              type="text"
              placeholder="Reply..."
              className="w-full border rounded px-3 py-1"
              defaultValue={rev.reply || ""}
              onBlur={(e) => handleReply(rev.id, e.target.value)}
            />
          </div>
        ))
      ) : (
        <p>No ratings yet.</p>
      )}
    </div>
  );
};

export default CustomerInteractionTab;
