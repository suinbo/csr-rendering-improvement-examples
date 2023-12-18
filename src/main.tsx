import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app"

const enableMocking = async () => {
    if (process.env.NODE_ENV !== "development") {
        return
    }

    const { worker } = await import("@/utils/apis/moks/browers")
    return worker.start()
}

enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
})
