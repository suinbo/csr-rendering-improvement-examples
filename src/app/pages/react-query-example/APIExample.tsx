import { apiRequest, useFetch } from "@/utils/apis/request"
import { useEffect, useState } from "react"

const APIExample = () => {
    const [hasToken, setHasToken] = useState<string>("")

    useEffect(() => setHasToken(localStorage.getItem("accessToken") as string), [])

    const { data: category, isLoading: isCategoryLoading } = useFetch({
        queryKey: ["CATEGORY"],
        queryFn: () => apiRequest("/browse/categories?country=KR"),
        enabled: !!hasToken,
    })

    const { data: albums, isLoading: isAlbumLoading } = useFetch({
        queryKey: ["ALBUM"],
        queryFn: () => apiRequest("/albums/4aawyAB9vmqN3uQ7FjRGTy"),
        enabled: !!hasToken,
    })

    if (isCategoryLoading || isAlbumLoading) {
        return <>...Loading</>
    }

    return <>{}</>
}

export default APIExample
