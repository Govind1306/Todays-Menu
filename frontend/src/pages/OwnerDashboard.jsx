import React from "react";
import TodayMenuForm from "../components/TodayMenuForm";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  return (
    <div className="owner-dashboard">
      <div className="owner-header">
        <h2>Welcome Back, Govind 👨‍🍳</h2>
        <p>Let’s update your menu for today</p>
      </div>

      <TodayMenuForm />
    </div>
  );
};

export default OwnerDashboard;
