import { useEffect, useState } from "react"
import { LoaderContext } from "./LoaderContext"
import { Loader } from "@/components/layout/loader"
import { registerLoader } from "@/utils/provider-bridges"

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [appLoading, setAppLoading] = useState<boolean>(true)

    useEffect(() => {
        registerLoader(setLoading)
    }, [])

    return (
        <LoaderContext.Provider value={{ loading, setLoading, appLoading, setAppLoading }}>
            {children}
            {
                loading && (
                    <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50 backdrop-blur-[0.65px]">
                        <Loader />
                    </div>
                )
            }
        </LoaderContext.Provider>
    )
}