import { useFetches } from "@/utils/apis/request"

const APIExample = () => {
    useFetches(["/v1/browse/categories?country=KR", "/v1/albums/4aawyAB9vmqN3uQ7FjRGTy"], {
        onSuccess: res => {
            console.log(res)
        },
    })

    return <></>
}

export default APIExample
