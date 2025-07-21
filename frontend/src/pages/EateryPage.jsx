// src/pages/EateryPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient"; // update path if different

const EateryPage = () => {
  const { id } = useParams(); // UUID from URL
  const [eatery, setEatery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchEatery = async () => {
      const { data, error } = await supabase
        .from("eateries")
        .select("*")
        .eq("id", id)
        .single(); // ensures we only get one result

      if (error || !data) {
        console.error(error);
        setNotFound(true);
      } else {
        setEatery(data);
      }

      setLoading(false);
    };

    fetchEatery();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (notFound) return <p>Eatery not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{eatery.name}</h2>
      <p>
        <strong>City:</strong> {eatery.city}
      </p>
      <p>
        <strong>Address:</strong> {eatery.address}
      </p>
      <p>
        <strong>Cuisine:</strong> {eatery.cuisine}
      </p>
      <p>
        <strong>Pincode:</strong> {eatery.pincode}
      </p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default EateryPage;
