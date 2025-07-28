// src/components/RegisterEateryForm.jsx

import React, { useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- CHANGE 1: NO LONGER IMPORT useJsApiLoader ---
import { Autocomplete } from "@react-google-maps/api";

const cuisines = [
  "South Indian",
  "North Indian",
  "Chinese",
  "Snacks",
  "Desserts",
];

// --- CHANGE 2: "libraries" IS NO LONGER NEEDED HERE ---

const RegisterEateryForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    pincode: "",
    cuisine: [],
    location: null,
  });

  // --- CHANGE 3: REMOVE THE ENTIRE useJsApiLoader HOOK ---
  // The script is now loaded globally in main.jsx

  const autocompleteRef = useRef(null);

  const onLoad = (autocomplete) => {
    console.log("Autocomplete component loaded.");
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();

      if (!place.geometry || !place.geometry.location) {
        toast.error("Please select a valid location from the suggestions.");
        return;
      }

      const address = place.formatted_address;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      let city = "";
      let pincode = "";

      if (place.address_components) {
        for (const component of place.address_components) {
          if (component.types.includes("locality")) city = component.long_name;
          if (component.types.includes("postal_code"))
            pincode = component.long_name;
        }
      }

      setFormData((prev) => ({
        ...prev,
        address,
        city,
        pincode,
        location: `POINT(${lng} ${lat})`,
      }));

      toast.success("Location selected!");
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;

    if (!userId) return toast.error("User not logged in");

    const { error } = await supabase.from("eateries").insert([
      {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode.toString(),
        cuisine: formData.cuisine,
        location: formData.location,
        owner_id: userId,
      },
    ]);

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success("Eatery registered successfully!");
      setTimeout(() => navigate("/eateries"), 2000);
    }
  };

  // --- CHANGE 4: REMOVE THE if (!isLoaded) LOADING GUARD ---
  // It is no longer needed because the component won't render until
  // the App is ready, and the script is loaded with the App.

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register Your Eatery
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Eatery Name and Description fields... */}
          <div>
            <label className="block mb-1">Eatery Name</label>
            <input
              required
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Autocomplete component is now much simpler */}
          <div>
            <label className="block mb-1">Search Location</label>
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
              options={{
                componentRestrictions: { country: "in" },
              }}
            >
              <input
                type="text"
                placeholder="Search for an address or business"
                className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none"
              />
            </Autocomplete>
          </div>

          {/* Rest of your form */}
          <div>
            <label className="block mb-1">Auto-filled Address</label>
            <textarea
              readOnly
              value={formData.address}
              className="w-full px-4 py-2 bg-gray-700 rounded text-gray-300"
              rows={2}
            />
          </div>
          <div>
            <label className="block mb-1">Auto-filled City</label>
            <input
              readOnly
              value={formData.city}
              className="w-full px-4 py-2 bg-gray-700 rounded text-gray-300"
            />
          </div>
          <div>
            <label className="block mb-1">Auto-filled Pincode</label>
            <input
              readOnly
              value={formData.pincode}
              className="w-full px-4 py-2 bg-gray-700 rounded text-gray-300"
            />
          </div>
          <div>
            <label className="block mb-2">Cuisine Types</label>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((tag) => (
                <span
                  key={tag}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      cuisine: prev.cuisine.includes(tag)
                        ? prev.cuisine.filter((c) => c !== tag)
                        : [...prev.cuisine, tag],
                    }))
                  }
                  className={`px-3 py-1 rounded-full cursor-pointer border text-sm ${
                    formData.cuisine.includes(tag)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded mt-4"
          >
            Submit Eatery
          </button>
        </form>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
      />
    </div>
  );
};

export default RegisterEateryForm;
