import { Button } from "@/components/ui/button";
import useModal from "@/hooks/useModal";

const TestPage = () => {

    const { modal, showModal } = useModal()

    const handleOpenDialog = () => {
        showModal({
            title: 'Test ONe',
            description: 'MEMMEME',
            content: <div>
            </div>,
            onSubmit: () => {
                console.log('djhsdhjsd')
            }
        })
    }

    return (
        <>
            <Button onClick={handleOpenDialog}>
                Click Me
            </Button>
            {modal}
        </>
    );
}

export default TestPage;
