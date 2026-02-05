import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks"

export const GuestRoute = () => {
    const { currentUser } = useAuth()

    if (currentUser) {
        return < Navigate to={'/'} />
    }

    return <Outlet />
}