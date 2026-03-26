import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'src/pages/login.html'),
                dashboard: resolve(__dirname, 'src/pages/dashboard.html'),
                about: resolve(__dirname, 'src/pages/about.html'),
                support_us: resolve(__dirname, 'src/pages/support-us.html')
            },
        },
    },
});
