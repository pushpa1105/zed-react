// src/utils/loaderBridge.ts
let setLoadingRef: ((v: boolean) => void) | null = null

export const registerLoader = (setLoading: (v: boolean) => void) => {
    setLoadingRef = setLoading
}

export const setGlobalLoading = (value: boolean) => {
    setLoadingRef?.(value)
}
