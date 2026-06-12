import { createContext } from "react";

export const LoaderContext = createContext({
    loading: false as boolean,
    setLoading: (_: boolean) => { },
    appLoading: false as boolean,
    setAppLoading: (_: boolean) => { }
})