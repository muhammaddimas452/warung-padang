import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal("login");
    navigate("/", { replace: true });
  }, [navigate, openAuthModal]);

  return null;
};

export default Login;
