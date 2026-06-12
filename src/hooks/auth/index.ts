import { AuthContext } from "@/context/auth/AuthContext";
import { useContext } from "react";

export const useAuth = () => useContext(AuthContext)
