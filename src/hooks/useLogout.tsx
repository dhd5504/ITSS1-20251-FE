import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import apiClient from "@/lib/axios";

export const useLogout = () => {
  const navigate = useNavigate();
  const logoutStore = useAppStore((state) => state.logout);

  const logout = async () => {
    try {
      const response = await apiClient.put("api/auth/logout");
      if (response.status === 200) {
        logoutStore();
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { logout };
};
