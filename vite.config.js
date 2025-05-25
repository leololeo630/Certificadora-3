import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173, // Porta padrão do Vite
        proxy: {
            // Redireciona requisições que começam com /api para o seu servidor backend
            '/api': {
                target: 'http://localhost:3001', // URL do servidor Node.js
                changeOrigin: true, // Necessário para virtual hosted sites
                secure: false, // Se o seu backend não usa HTTPS em desenvolvimento
            },
        },
    },
});
