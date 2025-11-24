import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import apiClient from "@/lib/axios";

export const useLogout = () => {
  const navigate = useNavigate();
  const logoutStore = useAppStore((state) => state.logout);

  const logout = async () => {
    const response = await apiClient.post("api/auth/logout");
    if (response.status === 200) {
      logoutStore();
      navigate("/login");
    }
  };

  return { logout };
};
