import LoginPage from "./pages/LoginPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import EateryList from "./pages/EateryList";
import UserDashboard from "./pages/UserDashboard";
import RegisterEateryForm from "./pages/RegisterEateryForm";
import WelcomePage from "./pages/WelcomePage";
import OwnerDashboard from "./pages/OwnerDashboard";
import EateryDetailPage from "./pages/EateryDetailPage";
import EateryPage from "./pages/EateryPage";
import HomePage from "./pages/HomePage";
// import RegisterEateryForm from "./pages/RegisterEateryForm";
import "./App.css"; // Ensure Tailwind CSS is imported

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/register-eatery" element={<RegisterEateryForm />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/eateries" element={<UserDashboard />} />
          <Route path="/eateries/:id" element={<EateryPage />} />
          <Route path="/Home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
