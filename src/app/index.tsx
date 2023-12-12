import Router from "@/route"
import { QueryClient, QueryClientProvider } from "react-query"

const App = () => {
    //TODO: 에러 핸들링
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <Router />
        </QueryClientProvider>
    )
}

export default App
