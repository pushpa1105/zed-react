import { useAuth } from "../hooks"

const Home = () => {
    const { currentUser } = useAuth()

    console.log(currentUser)
    return (
        <div>
            Home Sweet Home, {currentUser?.name}
        </div>
    )
}

export default Home
