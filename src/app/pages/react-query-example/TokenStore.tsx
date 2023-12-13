import { fetchToken } from "@/utils/apis/request"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

const TokenStore = () => {
    const navigate = useNavigate()
    const { isLoading, isError } = useQuery("token", fetchToken, {
        onSuccess: token => {
            navigate("/react-query-test")
            localStorage.setItem("accessToken", token)
        },
    })

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (isError) {
        return <p>Error fetching token</p>
    }

    return <></>
}

export default TokenStore
