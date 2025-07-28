import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const MenuProfileTab = ({ restId }) => {
  const [profile, setProfile] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: eatery } = await supabase
        .from("eateries")
        .select("*")
        .eq("id", restId)
        .single();

      const { data: menu } = await supabase
        .from("menu_items")
        .select("*")
        .eq("eatery_id", restId);

      setProfile(eatery);
      setMenuItems(menu);
    };

    fetchData();
  }, [restId]);

  return (
    <div className="grid gap-6">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
        {profile && (
          <div>
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Address:</strong> {profile.address}
            </p>
            {/* Add more editable fields here */}
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Menu Items</h2>
        {menuItems?.map((item) => (
          <div key={item.id} className="border p-2 rounded mb-2">
            <p>
              {item.name} - ₹{item.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuProfileTab;
