import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthModal from "./components/authModal";
import Home from "./pages/Home";
import MenuDetail from "./pages/Detail";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoute from "./components/privateRoute";
import AdminDashboard from "./pages/DahsboardAdmin";
import AdminRoute from "./components/adminRoute";
import "swiper/css";
import "swiper/css/autoplay";

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <AuthModal />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/menu/:id" element={<MenuDetail />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
