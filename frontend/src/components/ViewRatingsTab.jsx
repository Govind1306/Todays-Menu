import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const ViewsRatingsTab = ({ restId }) => {
  const [views, setViews] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: eatery } = await supabase
        .from("eateries")
        .select("view_count") // or fetch from views table
        .eq("id", restId)
        .single();
      setViews(eatery?.view_count || 0);

      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*")
        .eq("eatery_id", restId)
        .order("created_at", { ascending: false });

      setReviews(reviewData);
    };

    fetchData();
  }, [restId]);

  return (
    <div className="grid gap-6">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold">Views</h2>
        <p>Total Profile Views: {views}</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Track Views & Ratings</h2>
        <p className="text-lg font-bold">
          {views.toLocaleString()}{" "}
          <span className="font-normal text-sm">Profile views</span>
        </p>
        <p className="text-lg font-bold">
          {reviews.length > 0
            ? (
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              ).toFixed(1)
            : "0.0"}{" "}
          <span className="font-normal text-sm">Average rating</span>
        </p>
      </div>
    </div>
  );
};

export default ViewsRatingsTab;
