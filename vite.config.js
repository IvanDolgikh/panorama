import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
    plugins: [vue(), svgLoader()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@views': path.resolve(__dirname, './src/views'),
            '@styles': path.resolve(__dirname, './src/assets/styles'),
            '@svg-images': path.resolve(__dirname, './src/assets/images/svg'),
            '@other-images': path.resolve(__dirname, './src/assets/images/other'),
            '@services': path.resolve(__dirname, './src/services'),
            '@stores': path.resolve(__dirname, './src/stores'),
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @use "@/assets/styles/variables.scss" as *;
                    @use "@/assets/styles/mixins.scss" as *;
                `
            }
        }
    }
})