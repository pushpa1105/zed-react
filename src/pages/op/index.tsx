import { fetchRootPanas } from "@/lib/store/features/pana/panaSlice"
import { useAppDispatch } from "@/lib/store/hooks"
import { useEffect } from "react"

export default function Op() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchRootPanas())
    }, [dispatch]) // ← add this

    return (
        <div className="max-w-3xl mx-auto">
            Value:
        </div>
    )
}