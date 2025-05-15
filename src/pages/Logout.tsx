import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Logout = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    instance.logoutRedirect();
    navigate("/login");
  }, [instance, navigate]);

  return null;
};

export default Logout;
