import type { AuthUserType, LoginFormType } from "@/types";
import { createContext } from "react";

export const AuthContext = createContext({
    currentUser: null as AuthUserType | null,
    setCurrentUser: (_) => { },
    signOut: () => { },
    signIn: (_: LoginFormType) => { }
})