import {defineConfig} from 'vite'
import {fileURLToPath, URL} from "url";
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue({script: {defineModel: true}})],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@gen': fileURLToPath(new URL('./src-generated', import.meta.url))
        }
    }
})
