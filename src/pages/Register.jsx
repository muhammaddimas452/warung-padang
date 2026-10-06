import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal("register");
    navigate("/", { replace: true });
  }, [navigate, openAuthModal]);

  return null;
};

export default Register;
