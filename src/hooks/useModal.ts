import ZedModal from "@/components/modals/ZedModal";
import { createElement, useCallback, useMemo, useState, type ReactNode } from "react";

interface ModalConfig {
    title: string,
    description?: string,
    content?: ReactNode,
    onSubmit: () => void
}

export default function useModal() {
    const [modalConfig, setModalConfig] = useState<null | ModalConfig>(null)

    const handleClose = useCallback(() => setModalConfig(null), [])

    const modal = useMemo(() => {
        if (!modalConfig) return null;

        const { title, description, content, onSubmit } = modalConfig

        return createElement(ZedModal, {
            title,
            description,
            children: content,
            open: true,
            onOpenChange: handleClose,
            onSubmit,
        })
    }, [modalConfig, handleClose])


    const showModal = useCallback(({
        title,
        description,
        content,
        onSubmit
    }: ModalConfig) => {
        setModalConfig(
            {
                title,
                description,
                content,
                onSubmit
            }
        )
    }, [])

    return { modal, showModal }
}