import { useNavigate } from "react-router-dom";
import { User, Store } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-5xl md:text-6xl font-bold mb-6">FoodFindr</h1>
      <p className="text-xl md:text-2xl text-gray-400 text-center mb-4">
        Discover local eateries and manage your digital menu
      </p>
      <p className="text-base md:text-lg text-gray-500 text-center mb-16">
        Find or manage restaurants, all in one place.
      </p>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 w-full max-w-5xl">
        {/* Customer */}
        <div
          // onClick={() => navigate("/login?role=user")}
          onClick={() => navigate("/signIn")}
          className="cursor-pointer bg-gray-800 hover:bg-gray-750 transition p-8 rounded-xl shadow-lg border border-gray-700"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4">
            I'm a Customer
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Search for local eateries and explore daily menus.
          </p>
          <div className="space-y-3 text-gray-400">
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Browse eateries near you</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>View today's specials</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Instant directions & contact</span>
            </div>
          </div>
        </div>

        {/* Owner */}
        <div
          onClick={() => navigate("/signIn")}
          className="cursor-pointer bg-gray-800 hover:bg-gray-750 transition p-8 rounded-xl shadow-lg border border-gray-700"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4">
            I'm an Owner
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Sign in to manage your eatery profile and daily menu.
          </p>
          <div className="space-y-3 text-gray-400">
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Update your menu easily</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Track views and ratings</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Manage your business profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
