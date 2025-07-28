import React, { useEffect, useState } from "react";
import { User, Store, Eye, Star, MessageCircle } from "lucide-react";
import { supabase } from "../supabaseClient"; // adjust path if needed
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [profileComplete, setProfileComplete] = useState(false);
  const [businessRegistered, setBusinessRegistered] = useState(false);
  const [messes, setMesses] = useState([]);

  // Fetch user ID
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  const navigate = useNavigate();

  // Fetch profile and messes
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      // Fetch owner profile
      const { data: owner } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      console.log(owner, "owner data");

      if (owner) {
        console.log(owner);
        console.log("test");

        setUserName(owner.full_name || "Owner");
        setProfileComplete(!!(owner.name && owner.phone && owner.city)); // adjust fields as per your schema
      }

      // Fetch messes
      const { data: messData } = await supabase
        .from("eateries")
        .select("*")
        .eq("owner_id", userId);

      if (messData) {
        setBusinessRegistered(messData.length > 0);
        setMesses(
          messData.map((mess) => ({
            id: mess.id,
            name: mess.name,
            features: [
              {
                icon: <User className="w-4 h-4" />,
                text: "Manage menu and profile",
              },
              {
                icon: <Eye className="w-4 h-4" />,
                text: "Track views and ratings",
              },
              {
                icon: <MessageCircle className="w-4 h-4" />,
                text: "Interact with customers",
              },
            ],
          }))
        );
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8">Welcome, {userName}</h1>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Complete Profile Card */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
              <User className="w-6 h-6 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Complete Your Profile
            </h2>
            <p className="text-gray-400 mb-4">
              Finish setting up your mess owner profile
            </p>
            <button
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                profileComplete
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {profileComplete ? "✓ Profile Complete" : "Complete Profile"}
            </button>
          </div>

          {/* Register Business Card */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
              <Store className="w-6 h-6 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Register Your Business
            </h2>
            <p className="text-gray-400 mb-4">
              Add your mess to FoodFindr directory
            </p>
            <div
              style={{
                border: "none",
                display: "flex",
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <button
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  businessRegistered
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                onClick={() =>
                  !businessRegistered && navigate("/register-eatery")
                } // Adjust the navigation logic as needed
              >
                {businessRegistered ? "Business Registered" : "Register Mess"}
              </button>
              {businessRegistered && (
                <button
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${"bg-blue-600 hover:bg-blue-700 text-white"}`}
                  onClick={() => navigate("/register-eatery")} // Adjust the navigation logic as needed
                >
                  Register another Mess
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Your Messes Section */}
        {messes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Messes</h2>
            <div className="space-y-4">
              {messes.map((mess) => (
                <div
                  key={mess.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{mess.name}</h3>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors"
                      onClick={() => navigate(`/eatery-dashboard/${mess.id}`)}
                    >
                      View Dashboard
                    </button>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {mess.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-300"
                      >
                        <span className="mr-3 text-blue-400">
                          {feature.icon}
                        </span>
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {messes.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
            <Store className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Messes Registered</h3>
            <p className="text-gray-400 mb-4">
              Start by registering your first mess to get started with FoodFindr
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors">
              Register Your First Mess
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
