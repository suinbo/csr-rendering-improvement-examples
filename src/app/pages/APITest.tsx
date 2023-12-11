import { fetchToken } from "@/utils/api/getToken"
import { useQuery } from "react-query"

const APITest = () => {
    const { data: token, isLoading, isError } = useQuery("token", fetchToken)

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (isError) {
        return <p>Error fetching token</p>
    }

    if (token) {
        localStorage.setItem("accessToken", token)
    }

    return <></>
}

export default APITest
