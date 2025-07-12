import LoginPage from "./pages/LoginPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import EateryList from "./pages/EateryList";
import UserDashboard from "./pages/UserDashboard";
import RegisterEateryForm from "./pages/RegisterEateryForm";
import WelcomePage from "./pages/WelcomePage";
import OwnerDashboard from "./pages/OwnerDashboard";
import EateryDetailPage from "./pages/EateryDetailPage";
// import RegisterEateryForm from "./pages/RegisterEateryForm";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/eateries" element={<UserDashboard />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/register-eatery" element={<RegisterEateryForm />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/eatery/:id" element={<EateryDetailPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
