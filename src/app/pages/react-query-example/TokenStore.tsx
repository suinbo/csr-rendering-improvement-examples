import { fetchToken } from "@/utils/apis/request"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

const TokenStore = () => {
    const navigate = useNavigate()
    const { data: token, isLoading, isError } = useQuery("token", fetchToken)

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (isError) {
        return <p>Error fetching token</p>
    }

    if (token) {
        navigate("/api-test")
        localStorage.setItem("accessToken", token)
    }

    return <></>
}

export default TokenStore
