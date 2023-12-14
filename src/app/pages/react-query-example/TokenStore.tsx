import { tokenRequest } from "@/utils/apis/request"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

const TokenStore = () => {
    const navigate = useNavigate()

    useQuery("token", tokenRequest, {
        onSuccess: () => {
            navigate("/react-query-test")
        },
    })

    return <></>
}

export default TokenStore
