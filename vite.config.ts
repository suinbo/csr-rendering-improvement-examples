import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path" // node 타입

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src/app"),
            "@assets": resolve(__dirname, "src/assets"),
        },
    },
    plugins: [react()],
})
