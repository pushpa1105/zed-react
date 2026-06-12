import { Navigate, Outlet } from "react-router-dom"
import { useAuth, useLoader } from "@/hooks"
import { AppLoader } from "@/components/layout/app-loader"
import { ROUTES } from "@/constants"

export const ProtectedRoute = () => {
    const { currentUser } = useAuth()
    const { appLoading } = useLoader()

    if (appLoading) return <AppLoader />

    if (!currentUser) {
        return < Navigate to={ROUTES.LOGIN} />
    }

    return <Outlet />
}