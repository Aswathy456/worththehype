import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from "./context/RestaurantContext";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import AddReview from "./pages/AddReview";
import { Login, Signup, ForgotPassword } from "./pages/AuthPages";

function App() {
  return (
    <BrowserRouter>
      <RestaurantProvider>
        <Routes>
          <Route path="/login"            element={<Login />} />
          <Route path="/signup"           element={<Signup />} />
          <Route path="/forgot-password"  element={<ForgotPassword />} />
          <Route path="/"                 element={<Home />} />
          <Route path="/restaurant/:id"   element={<RestaurantDetail />} />
          <Route path="/restaurant/:id/review" element={<AddReview />} />
        </Routes>
      </RestaurantProvider>
    </BrowserRouter>
  );
}

export default App;