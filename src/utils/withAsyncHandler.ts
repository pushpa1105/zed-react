import { toast } from "sonner" // or react-hot-toast / toast lib
import { setGlobalLoading } from "@/utils/provider-bridges"

type AsyncHandlerOptions = {
    showLoader?: boolean
    showErrorToast?: boolean
    onSuccess?: (res: any) => void
    onError?: (err: any) => void
    onFinally?: () => void
}

export const withAsyncHandler = async <T>(
    asyncFn: () => Promise<T>,
    options?: AsyncHandlerOptions
) => {
    const {
        showLoader = true,
        showErrorToast = true,
        onSuccess,
        onError,
        onFinally,
    } = options || {}


    try {
        if (showLoader) setGlobalLoading(true)
        const res = await asyncFn();
        onSuccess?.(res)
    } catch (err: any) {
        if (onError) {
            onError(err)
        } else if (showErrorToast) {
            toast.error(
                err?.response?.data?.message || "Something went wrong"
            )
        }
        throw err // allows optional caller catch
    } finally {
        if (showLoader) setGlobalLoading(false)
        onFinally?.()
    }
}
