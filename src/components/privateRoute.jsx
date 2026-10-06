import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import { useEffect } from "react";
import toast from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      openAuthModal("login");
    }
  }, [user, openAuthModal]);

  return user ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;

