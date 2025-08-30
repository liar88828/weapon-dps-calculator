import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react-swc'
import path from "path"
import { defineConfig } from 'vite'
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/weapon-dps-calculator',
    build: {
        // chunkSizeWarningLimit: 1000, // increase to 1MB
        // rollupOptions: {
        //     output: {
        //         manualChunks: {
        //             vendor: [ "react", "react-dom" ]
        //         },
        //     }
        // }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
