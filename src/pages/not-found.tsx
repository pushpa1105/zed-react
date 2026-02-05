import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate()

    const goToHome = () => navigate('/')
    return (
        <div className="h-screen w-screen flex justify-center items-center text-center">
            <div>
                <h1>Not Found</h1>
                <div className="font-bold text-9xl mb-2">
                    404
                </div>
                <Button variant="link" onClick={goToHome}>
                    Go to Home
                </Button>
            </div>
        </div>
    )
};

export default NotFound;