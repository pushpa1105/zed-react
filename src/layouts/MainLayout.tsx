import { AppLoader } from "@/components/layout/app-loader"
import { useLoader } from "@/hooks"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
    const { appLoading } = useLoader()

    if (appLoading) return <AppLoader />

    return (
        <>
            <div>
                <Outlet />
            </div>
        </>
    )
}

export default MainLayout