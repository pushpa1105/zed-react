import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext";
import { fetchAuthenticatedUser, login, logout } from "@/services";
import { useLoader } from "@/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import type { AuthUserType, LoginFormType } from "@/types";
import { withAsyncHandler } from "@/utils/withAsyncHandler";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const { setAppLoading } = useLoader()
    const location = useLocation()
    const navigate = useNavigate()

    const setLoginInfo = (data: AuthUserType) => {
        if (!data) return
        localStorage.setItem('isLoggedIn', 'true')
    }

    const clearAuthInfo = () => {
        localStorage.removeItem('isLoggedIn')
    }

    const signOut = async () => {
        await withAsyncHandler(
            () => logout(),
            {
                onSuccess: () => {
                    clearAuthInfo()
                    navigate('/login')
                }
            }
        )
    }

    const signIn = async (data: LoginFormType) => {
        await withAsyncHandler(
            () => login(data),
            {
                onSuccess: (res) => {
                    const data = res?.data?.data
                    setCurrentUser(data?.user)
                    navigate('/')
                }
            }
        )
    }

    useEffect(() => {
        if (location.pathname === "/login") {
            setAppLoading(false)
            return
        }
        setAppLoading(true)
        fetchAuthenticatedUser()
            .then((res) => {
                const data = res?.data?.data
                setCurrentUser(data)
                setLoginInfo(data)
            })
            .catch((err) => {
                clearAuthInfo()
            })
            .finally(() => setAppLoading(false))
    }, [setCurrentUser, setAppLoading, location])

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, signOut, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}