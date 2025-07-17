import React from "react";
import EateryList from "./EateryList";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const UserDashboadrd = () => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      console.log("User :", authData);

      if (userId) {
        const { data, error } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", userId)
          .single();

        if (!error) {
          setUserData(data);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ borderBottom: "2px solid blue" }}>
        Welcome {userData?.full_name || "User Name"}, Eateries near you
      </h1>
      <EateryList />
    </div>
  );
};

export default UserDashboadrd;
