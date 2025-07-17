import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./RegisterEateryForm.css";

const RegisterEateryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    pincode: "",
    cuisine: [],
    location: null,
    logo: null,
    coverImage: null,
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

  // 🍽️ cuisine options
  const cuisines = [
    "South Indian",
    "North Indian",
    "Chinese",
    "Snacks",
    "Desserts",
  ];

  // 📍 Auto-detect location on mount
  useEffect(() => {
    const detectLocation = async () => {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            const res = await fetch(
              `http://localhost:5000/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
            );
            const loc = await res.json();

            if (loc.city && loc.pincode) {
              setFormData((prev) => ({
                ...prev,
                city: loc.city,
                pincode: loc.pincode,
                location: `POINT(${longitude} ${latitude})`, // <- SRID 4326 format
              }));
              toast.success("Location auto-filled");
            } else {
              toast.warning("Could not auto-fill location");
            }
          } catch (err) {
            toast.error("Location fetch failed", err);
          }
          setLoadingLocation(false);
        },
        () => {
          toast.error("Location access denied");
          setLoadingLocation(false);
        }
      );
    };

    detectLocation();
  }, []);

  // 🔥 Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    const { name, description, address, city, pincode, cuisine } = formData;

    const { error } = await supabase.from("eateries").insert([
      {
        name: formData.name,
        city: formData.city,
        address: formData.address,
        description: formData.description,
        created_by: userId, 
        cuisine: formData.cuisine,
        pincode: formData.pincode.toString(), // ensure string
        location: formData.location, // 👈 must be in `POINT(lon lat)` format
        // logo_url: '...',        // optional: once you handle file upload
        // cover_image_url: '...', // optional: same here
      },
    ]);

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success("Eatery registered successfully!");
      setTimeout(() => navigate("/eateries"), 1500);
    }
  };

  return (
    <div className="eatery-form-container">
      <form className="eatery-form" onSubmit={handleSubmit}>
        <h2>Register Your Eatery</h2>

        <label>Eatery Name</label>
        <input
          name="name"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <label>Description</label>
        <textarea
          name="description"
          required
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <label>Full Address</label>
        <textarea
          name="address"
          required
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />

        <div className="inline-fields">
          <div>
            <label>
              City{" "}
              {loadingLocation && (
                <span style={{ fontSize: "12px" }}>detecting...</span>
              )}
            </label>
            <input name="city" value={formData.city} readOnly />
          </div>
          <div>
            <label>Pincode</label>
            <input name="pincode" value={formData.pincode} readOnly />
          </div>
        </div>

        <label>Cuisine Types</label>
        <div className="cuisine-tags">
          {cuisines.map((tag) => (
            <span
              key={tag}
              className={
                formData.cuisine.includes(tag) ? "tag selected" : "tag"
              }
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  cuisine: prev.cuisine.includes(tag)
                    ? prev.cuisine.filter((c) => c !== tag)
                    : [...prev.cuisine, tag],
                }))
              }
            >
              {tag}
            </span>
          ))}
        </div>

        <button className="primary-btn" type="submit">
          Submit Eatery
        </button>
      </form>

      {/* Toast container */}
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
      />
    </div>
  );
};

export default RegisterEateryForm;
