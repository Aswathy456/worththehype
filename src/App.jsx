import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import AddReview from "./pages/AddReview";
import NavBar from "./components/NavBar";
import { Login, Signup, ForgotPassword } from "./pages/AuthPages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no NavBar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* App pages — with NavBar */}
        <Route path="/*" element={
          <>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/restaurant/:id/review" element={<AddReview />} />
            </Routes>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;