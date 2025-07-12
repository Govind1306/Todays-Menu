import React from "react";
import EateryList from "./EateryList";

const UserDashboadrd = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ borderBottom: "2px solid blue" }}>Eateries near you</h1>
      <EateryList />
    </div>
  );
};

export default UserDashboadrd;
