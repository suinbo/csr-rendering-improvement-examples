import { useFetch } from "@/utils/apis/request"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { sendErrorToErrorTracker } from "./utils"
import { APIData } from "@/utils/apis/response.types"

const APIExample = () => {
    const Content = () => {
        useFetch("/v1/browse/categories?country=KR")

        const {
            data: { data: albums },
        } = useFetch("/v1/albums/4aawyAB9vmqN3uQ7FjRGTy") as APIData

        return <div>album_type: {albums.album_type}</div>
    }

    const ContentRenderFallback = <div>Rendering ...</div>

    const ContentErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
        <div>
            <p>에러 : {error.message}</p>
            <button onClick={resetErrorBoundary}>다시 시도</button>
        </div>
    )

    const handleOnError = (error: Error) => sendErrorToErrorTracker(error)

    return (
        <ErrorBoundary FallbackComponent={ContentErrorFallback} onError={handleOnError}>
            <Suspense fallback={ContentRenderFallback}>
                <Content />
            </Suspense>
        </ErrorBoundary>
    )
}

export default APIExample
