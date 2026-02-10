import api from "@/lib/api";
import type { LoginFormType, RegisterFormType } from "@/types";

export const login = async (data: LoginFormType) => await api.post('/login', data)
export const register = async (data: RegisterFormType) => await api.post('/register', data)
export const logout = async () => await api.post('/logout')
export const fetchAuthenticatedUser = async () => await api.get('/whoami')