import Router from "@/route"
import { QueryClient, QueryClientProvider } from "react-query"

const App = () => {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <Router />
        </QueryClientProvider>
    )
}

export default App
