import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get your Supabase project URL from environment variables or hardcode it
// You should have a .env file with VITE_SUPABASE_URL defined
// const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ooswtfgykyyatgasdgqz.supabase.co'; // No longer needed for proxy

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Proxy configuration is removed as functions are called directly via supabase.functions.invoke()
    port: 5173, // Keep your existing port or let Vite choose
  },
});
