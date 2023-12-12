import { apiRequest, useFetches } from "@/utils/apis/request"
import { useEffect, useState } from "react"

const APIExample = () => {
    const [hasToken, setHasToken] = useState<boolean>(false)

    useEffect(() => setHasToken(!!localStorage.getItem("accessToken")), [])

    const { data } = useFetches([
        {
            queryKey: ["CATEGORY"],
            queryFn: () => apiRequest("/browse/categories?country=KR"),
            enabled: hasToken,
        },
        {
            queryKey: ["ALBUM"],
            queryFn: () => apiRequest("/albums/4aawyAB9vmqN3uQ7FjRGTy"),
            enabled: hasToken,
        },
    ])

    return <></>
}

export default APIExample
