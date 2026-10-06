import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Jika belum login atau bukan admin → redirect ke beranda
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
