import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
  const { user, Loading, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (Loading) return;
    if (user) return;

    if (!user) {
      clearUser();
      navigate("/login");
    }
  }, [user, Loading, clearUser, navigate]);
};
