import LoginPage from "./pages/LoginPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import EateryList from "./pages/EateryList";
import UserDashboard from "./pages/UserDashboard";
import RegisterEateryForm from "./pages/RegisterEateryForm";
import WelcomePage from "./pages/WelcomePage";
import OwnerDashboard from "./pages/OwnerDashboard";
import EateryDetailPage from "./pages/EateryDetailPage";
import EateryPage from "./pages/EateryPage";
import EateryDashBoard from "./pages/EateryDashBoard";
import HomePage from "./pages/HomePage";
import { UserProvider } from "./context/UserContext";
// import RegisterEateryForm from "./pages/RegisterEateryForm";
import "./App.css"; // Ensure Tailwind CSS is imported
import { Home } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signIn" element={<LoginPage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/register-eatery" element={<RegisterEateryForm />} />
              <Route path="/owner-dashboard" element={<OwnerDashboard />} />
              <Route path="/eateries" element={<UserDashboard />} />
              <Route path="/eateries/:id" element={<EateryPage />} />
              <Route path="/Home" element={<HomePage />} />
              <Route
                path="/eatery-dashboard/:id"
                element={<EateryDashBoard />}
              />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </GoogleOAuthProvider>
    </>
  );
}
